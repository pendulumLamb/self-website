<template>
  <div class="relative bg-background" ref="container">
    <!-- Sticky Map Container (full viewport width, breaks out of parent max-w constraints) -->
    <div class="sticky top-0 h-screen overflow-hidden flex items-center justify-center" style="width: 100vw; margin-left: calc(50% - 50vw);">
      <div ref="chart" class="absolute inset-0 h-full flex items-center justify-center bg-background transition-colors duration-700" style="width: 100vw; left: 0;"></div>
      
      <!-- Optional: Global Title when no specific section is active or as a persistent header -->
      <div class="absolute top-24 left-1/2 -translate-x-1/2 text-center z-10 pointer-events-none mix-blend-multiply opacity-50">
        <h2 class="text-xl md:text-2xl tracking-[0.3em] font-light text-gray-500">全球设计艺术 驱动科技进化</h2>
      </div>
    </div>

    <!-- Scrollable Content Sections -->
    <div class="relative z-20 -mt-[100vh]">
       <!-- Intro Section: Map shows global view, no focus -->
       <!-- Reduced height to 50vh to minimize initial gap -->
       <div class="h-[50vh] flex items-center justify-center pointer-events-none" data-section="intro">
          <!-- Optional Intro Text -->
       </div>

       <div 
         v-for="(item, index) in designStyles" 
         :key="index" 
         class="h-[300vh] relative"
         :data-index="index"
       >
         <!-- Sticky Text Container -->
         <div class="sticky top-0 h-screen w-full flex items-center justify-center md:justify-end p-6 md:pr-8 md:pl-24 md:translate-x-10 pointer-events-none">
           <div class="max-w-xl w-full text-left md:text-right">
             <!-- Title Group -->
             <div
                class="mb-6 transition-all duration-700 ease-out origin-bottom"
                :style="{
                  opacity: getElementOpacity(index, 0),
                  transform: `translateY(${getElementTranslateY(index, 0)}px)`
                }"
              >
                <div class="flex items-baseline gap-4 md:justify-end mb-2">
                  <h3 class="text-6xl md:text-7xl font-bold text-neutral-400">{{ item.country }}</h3>
                </div>
                <h4 class="text-3xl md:text-4xl font-light text-neutral-600">{{ item.style }}</h4>
              </div>

             <!-- Description -->
             <p
               class="text-neutral-800 leading-loose text-2xl md:text-3xl transition-all duration-700 ease-out delay-100"
               :style="{ 
                 opacity: getElementOpacity(index, 1),
                 transform: `translateY(${getElementTranslateY(index, 1)}px)`
               }"
             >
               {{ item.description }}
             </p>
           </div>
         </div>
       </div>

       <div class="h-[100vh]"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, onUnmounted, computed } from 'vue'
import * as d3 from 'd3'
import { feature } from 'topojson-client'
import { useWindowSize, useWindowScroll, useElementBounding } from '@vueuse/core'

const chart = ref<HTMLElement | null>(null)
const container = ref<HTMLElement | null>(null)
const { width, height } = useWindowSize()
const { y } = useWindowScroll()

// State tracking for each section's progress
const sectionProgress = ref<number[]>([])

const designStyles = computed(() => [
  {
    country: '中国',
    style: '东方意象',
    description: '从青花、器物、留白和自然秩序中提取视觉语言，让作品保留东方气质，也能服务现代电商和数字界面。',
    coords: [104.19, 35.86],
    tags: []
  },
  {
    country: '日本',
    style: '清简秩序',
    description: '关注克制的版面、细节密度和微妙层次，用安静的视觉节奏组织内容，让信息更容易被感知。',
    coords: [138.25, 36.20],
    tags: []
  },
  {
    country: '法国',
    style: '艺术叙事',
    description: '借鉴时尚、摄影和艺术海报中的叙事方式，强化画面的情绪、质感和商业表达。',
    coords: [2.21, 46.22],
    tags: []
  },
  {
    country: '德国',
    style: '理性系统',
    description: '用网格、结构和可复用规则控制复杂度，把视觉风格沉淀为稳定的系统能力。',
    coords: [10.45, 51.16],
    tags: []
  },
  {
    country: '美国',
    style: '产品体验',
    description: '强调产品目标、用户路径和技术落地，把创意转化成可交互、可迭代、可验证的数字作品。',
    coords: [-95.71, 37.09],
    tags: []
  }
])

let projection: d3.GeoOrthographicProjection
let path: d3.GeoPath
let svg: d3.Selection<SVGSVGElement, unknown, null, undefined>
let g: d3.Selection<SVGGElement, unknown, null, undefined>
let markerGroup: d3.Selection<SVGGElement, unknown, null, undefined>

let baseScale = 1
let maxZoomScale = 1

onMounted(async () => {
  if (!chart.value) return

  const w = chart.value.clientWidth
  const h = chart.value.clientHeight
  baseScale = Math.min(w, h) / 2.5
  maxZoomScale = baseScale * 2.5 // Matches bixing: globe fills the screen when zoomed

  projection = d3.geoOrthographic()
    .scale(baseScale)
    .center([0, 0])
    .rotate([0, 0])
    .translate([w / 2, h / 2 + 50]) // Move down by 50px
    .clipAngle(90)

  path = d3.geoPath().projection(projection)

  svg = d3.select(chart.value)
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .attr("class", "cursor-move")
    .style("overflow", "visible")

  // Globe Outline/Water
  svg.append("circle")
    .attr("cx", w / 2)
    .attr("cy", h / 2 + 50)
    .attr("r", projection.scale())
    .style("fill", "#f4f4f5") // Cool grey-white globe background
    .style("stroke", "rgba(0,0,0,0.05)")
    .style("stroke-width", "1px")

  g = svg.append("g")

  try {
    const world = await d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json') as any
    const countries = (feature(world, world.objects.countries) as any).features

    const graticule = d3.geoGraticule()
    
    // Layer 1: Back Lines
    projection.clipAngle(180)
    g.append("path")
      .datum(graticule)
      .attr("class", "back-line")
      .attr("d", path)
      .style("fill", "none")
      .style("stroke", "#000")
      .style("stroke-opacity", "0.03")
      .style("stroke-width", "0.5px")

    // Layer 2: Back Countries
    g.selectAll(".back-country")
      .data(countries)
      .enter().append("path")
      .attr("class", "back-country")
      .attr("d", path)
      .style("fill", "#e4e4e7") // Cool light grey
      .style("stroke", "#fff")
      .style("stroke-width", "0")

    // Layer 3: Front Lines
    projection.clipAngle(90)
    g.append("path")
      .datum(graticule)
      .attr("class", "line")
      .attr("d", path)
      .style("fill", "none")
      .style("stroke", "#000")
      .style("stroke-opacity", "0.05")
      .style("stroke-width", "0.5px")

    // Layer 4: Front Countries
    g.selectAll(".country")
      .data(countries)
      .enter().append("path")
      .attr("class", "country")
      .attr("d", path)
      .style("fill", "#c8c8cc") // Cool medium grey
      .style("stroke", "#fff")
      .style("stroke-width", "0.5px")
      .style("transition", "fill 0.5s ease")

    // Layer 5: Marker Group
    markerGroup = svg.append("g")
      .attr("class", "marker-group")
      .style("pointer-events", "none")
      .style("opacity", "0")
      .style("transition", "opacity 0.3s ease")

    // Ripple Effect Rings
    markerGroup.append("circle")
      .attr("r", 8)
      .style("fill", "none")
      .style("stroke", "white")
      .style("stroke-width", "2")
      .style("opacity", "0.8")
      .append("animate")
      .attr("attributeName", "r")
      .attr("from", "8")
      .attr("to", "20")
      .attr("dur", "1.5s")
      .attr("repeatCount", "indefinite")
    
    markerGroup.append("circle")
      .attr("r", 8)
      .style("fill", "none")
      .style("stroke", "white")
      .style("stroke-width", "2")
      .style("opacity", "0.5")
      .append("animate")
      .attr("attributeName", "opacity")
      .attr("values", "0.8;0")
      .attr("dur", "1.5s")
      .attr("repeatCount", "indefinite")

    // Center Dot
    markerGroup.append("circle")
      .attr("r", 4)
      .style("fill", "white")
      
    // Country Label
    markerGroup.append("text")
      .attr("x", 25)
      .attr("y", 5)
      .style("fill", "#374151") // Cool dark grey text for contrast on light map
      .style("font-family", "Montserrat, sans-serif")
      .style("font-weight", "bold")
      .style("font-size", "14px")
      .style("text-shadow", "0 2px 4px rgba(255,255,255,0.8)") // White shadow for readability
      .style("opacity", "0")
      .style("transition", "opacity 0.5s ease 0.2s") // Delay text appearance
      .text("")
      
    // Animate text entry
    markerGroup.select("text")
      .append("animate")
      .attr("attributeName", "opacity")
      .attr("to", "1")
      .attr("dur", "0.5s")
      .attr("fill", "freeze")

    // Initial State: Global View
    updateMapState(-1, 0)

  } catch (e) {
    console.error('Failed to load map data', e)
  }
})

const currentIndex = ref(-1)

// Scroll Logic
watch(y, () => {
  if (!container.value || !projection) return

  const sections = document.querySelectorAll('[data-index]')
  let activeIndex = -1
  let activeProgress = 0
  
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i]
    const rect = section.getBoundingClientRect()

    if (rect.top <= 0 && rect.bottom > 0) {
      activeIndex = i
      activeProgress = Math.max(0, Math.min(1, -rect.top / rect.height))
      break
    }
  }

  if (activeIndex === -1) {
    if (sections.length > 0 && sections[0].getBoundingClientRect().top > 0) {
       updateMapState(-1, 0)
       currentIndex.value = -1
       sectionProgress.value = []
       return
    }
    
    const lastSection = sections[sections.length - 1]
    const lastRect = lastSection.getBoundingClientRect()
    
    if (lastRect && lastRect.bottom <= 0) {
       const exitProgress = Math.min(Math.max(-lastRect.bottom / window.innerHeight, 0), 1)
       updateMapState(-2, exitProgress)
       currentIndex.value = -2
       sectionProgress.value = []
       return
    }
  }
  
  currentIndex.value = activeIndex
  updateMapState(activeIndex, activeProgress)
  
  sectionProgress.value = Array.from(sections).map((s, i) => {
    if (i === activeIndex) return activeProgress
    return 0
  })
})

function updateMapState(index: number, progress: number) {
  if (!projection) return

  let targetScale = baseScale
  let targetRotation = [0, 0]
  let markerOpacity = 0
  
  if (index === -1) {
    targetScale = baseScale
    targetRotation = [0, 0] 
    markerOpacity = 0
    const w = chart.value?.clientWidth || width.value
    const h = chart.value?.clientHeight || height.value
    projection.translate([w / 2, h / 2 + 50])
  } else if (index === -2) {
    targetScale = baseScale
    const lastCity = designStyles.value[designStyles.value.length - 1]
    targetRotation = [-lastCity.coords[0], -lastCity.coords[1]]
    
    const w = chart.value?.clientWidth || width.value
    const h = chart.value?.clientHeight || height.value
    const defaultY = h / 2 + 50
    const targetY = defaultY - (h * 1.5 * progress) 
    
    projection.translate([w / 2, targetY])
    markerOpacity = 0
  } else {
    const target = designStyles.value[index]
    const cityCoords = [-target.coords[0], -target.coords[1]]
    
    const prevCity = index > 0 ? designStyles.value[index-1] : null
    const startRotation = prevCity ? [-prevCity.coords[0], -prevCity.coords[1]] : [0,0]

    const w = chart.value?.clientWidth || width.value
    const h = chart.value?.clientHeight || height.value
    projection.translate([w / 2, h / 2 + 50])
    
    if (progress < 0.25) {
       targetScale = baseScale
       const p = d3.easeCubicInOut(progress / 0.25)
       const r = d3.interpolate(startRotation, cityCoords)
       targetRotation = r(p) as [number, number]
       markerOpacity = 0
    } else if (progress < 0.4) {
       targetRotation = cityCoords as [number, number]
       const p = d3.easeCubicOut((progress - 0.25) / 0.15)
       targetScale = d3.interpolate(baseScale, maxZoomScale)(p)
       markerOpacity = p
    } else if (progress < 0.7) {
       targetScale = maxZoomScale
       targetRotation = cityCoords as [number, number]
       markerOpacity = 1
    } else {
       targetRotation = cityCoords as [number, number]
       const p = d3.easeCubicIn((progress - 0.7) / 0.3)
       targetScale = d3.interpolate(maxZoomScale, baseScale)(p)
       markerOpacity = 1 - p
    }
  }

  projection.scale(targetScale).rotate(targetRotation as [number, number, number])
  
  projection.clipAngle(180)
  g.selectAll(".back-line").attr("d", path)
  g.selectAll(".back-country").attr("d", path)
  
  projection.clipAngle(90)
  g.selectAll(".line").attr("d", path)
  g.selectAll(".country").attr("d", path)
  
  svg.select("circle").attr("r", targetScale)
  
  updateMarker(index, markerOpacity)
}

function updateMarker(index: number, opacity: number) {
  if (!markerGroup || index === -1) {
    markerGroup?.style("opacity", "0")
    return
  }

  const target = designStyles.value[index]
  const center = projection(target.coords as [number, number])

  if (center) {
    markerGroup.style("opacity", opacity.toString())
    markerGroup.attr("transform", `translate(${center[0]}, ${center[1]})`)
    markerGroup.select("text").text(target.country)
  } else {
    markerGroup.style("opacity", "0")
  }
}

function getElementOpacity(index: number, order: number) {
  const p = sectionProgress.value[index] || 0
  const baseStart = 0.4
  const delay = order * 0.05
  const start = baseStart + delay
  const end = start + 0.1
  
  if (p < start) return 0
  if (p < end) return (p - start) / (end - start)
  if (p < 0.7) return 1
  if (p < 0.8) return 1 - (p - 0.7) / 0.1
  return 0
}

function getElementTranslateY(index: number, order: number) {
  const p = sectionProgress.value[index] || 0
  const baseStart = 0.4
  const delay = order * 0.05
  const start = baseStart + delay
  const end = start + 0.15
  
  if (p < start) return 30
  if (p < end) return 30 * (1 - (p - start) / (end - start))
  if (p < 0.7) return 0
  return -20 * ((p - 0.7) / 0.1)
}

watch([width, height], () => {
  if (chart.value && projection) {
    const w = chart.value.clientWidth
    const h = chart.value.clientHeight
    baseScale = Math.min(w, h) / 2.5
    maxZoomScale = baseScale * 2.5 // Matches bixing: globe fills the screen when zoomed
    projection.translate([w / 2, h / 2 + 50]).scale(baseScale)
    
    svg.attr("width", w).attr("height", h)
    svg.select("circle").attr("cx", w/2).attr("cy", h/2 + 50).attr("r", projection.scale())
    
    projection.clipAngle(180)
    g.selectAll(".back-line").attr("d", path)
    g.selectAll(".back-country").attr("d", path)
    projection.clipAngle(90)
    g.selectAll(".line").attr("d", path)
    g.selectAll(".country").attr("d", path)
  }
})
</script>

<style scoped>
/* Ensure smooth transitions for any CSS properties */
</style>
