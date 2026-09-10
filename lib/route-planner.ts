export type Priority = 'fastest' | 'cheapest' | 'shortest' | 'traffic' | 'balanced'

export type City = { id: string; name: string; lat: number; lng: number; x: number; y: number }
export type Road = { from: string; to: string; distance: number; hours: number; traffic: 1 | 2 | 3; toll: number; fuel: number }
export type RouteResult = { path: string[]; roads: Road[]; distance: number; hours: number; toll: number; fuel: number; cost: number; traffic: number; explored: number; score: number }

export const cities: City[] = [
  { id: 'delhi', name: 'Delhi', lat: 28.61, lng: 77.21, x: 53, y: 13 },
  { id: 'jaipur', name: 'Jaipur', lat: 26.91, lng: 75.78, x: 42, y: 24 },
  { id: 'agra', name: 'Agra', lat: 27.18, lng: 78.01, x: 59, y: 25 },
  { id: 'udaipur', name: 'Udaipur', lat: 24.58, lng: 73.68, x: 30, y: 39 },
  { id: 'ahmedabad', name: 'Ahmedabad', lat: 23.02, lng: 72.57, x: 25, y: 51 },
  { id: 'surat', name: 'Surat', lat: 21.17, lng: 72.83, x: 30, y: 64 },
  { id: 'mumbai', name: 'Mumbai', lat: 19.08, lng: 72.88, x: 27, y: 78 },
  { id: 'pune', name: 'Pune', lat: 18.52, lng: 73.86, x: 39, y: 79 },
  { id: 'goa', name: 'Goa', lat: 15.49, lng: 73.83, x: 43, y: 94 },
  { id: 'nagpur', name: 'Nagpur', lat: 21.15, lng: 79.09, x: 61, y: 64 },
  { id: 'bhopal', name: 'Bhopal', lat: 23.26, lng: 77.41, x: 57, y: 48 },
  { id: 'hyderabad', name: 'Hyderabad', lat: 17.38, lng: 78.49, x: 59, y: 82 },
  { id: 'vijayawada', name: 'Vijayawada', lat: 16.51, lng: 80.65, x: 70, y: 87 },
  { id: 'chennai', name: 'Chennai', lat: 13.08, lng: 80.27, x: 76, y: 99 },
  { id: 'bangalore', name: 'Bangalore', lat: 12.97, lng: 77.59, x: 58, y: 101 },
  { id: 'mysore', name: 'Mysore', lat: 12.30, lng: 76.65, x: 50, y: 105 },
  { id: 'pondicherry', name: 'Pondicherry', lat: 11.94, lng: 79.83, x: 72, y: 108 },
  { id: 'visakhapatnam', name: 'Visakhapatnam', lat: 17.69, lng: 83.22, x: 88, y: 83 },
  { id: 'bhubaneswar', name: 'Bhubaneswar', lat: 20.30, lng: 85.82, x: 92, y: 63 },
]

const edge = (from: string, to: string, distance: number, hours: number, traffic: 1 | 2 | 3, toll: number, fuel: number): Road => ({ from, to, distance, hours, traffic, toll, fuel })
export const roads: Road[] = [
  edge('delhi','jaipur',280,5,2,350,2100), edge('delhi','agra',235,4,3,300,1750), edge('delhi','bhopal',750,13,2,900,5600),
  edge('jaipur','udaipur',395,7,1,500,3000), edge('jaipur','ahmedabad',670,11,2,750,4900), edge('udaipur','ahmedabad',260,5,1,350,1950),
  edge('ahmedabad','surat',265,5,2,300,2000), edge('surat','mumbai',285,5,3,400,2150), edge('mumbai','pune',150,3,3,220,1150),
  edge('pune','goa',460,9,1,450,3450), edge('pune','hyderabad',560,10,2,650,4200), edge('mumbai','nagpur',800,14,2,950,6000),
  edge('bhopal','nagpur',350,6,2,450,2650), edge('bhopal','hyderabad',700,12,2,800,5250), edge('agra','bhopal',600,11,2,700,4500),
  edge('nagpur','hyderabad',500,9,1,600,3750), edge('nagpur','bhubaneswar',700,13,1,800,5250), edge('hyderabad','vijayawada',275,5,2,350,2050),
  edge('hyderabad','bangalore',570,10,2,650,4300), edge('hyderabad','visakhapatnam',620,11,1,700,4650), edge('vijayawada','chennai',450,8,3,550,3400),
  edge('vijayawada','visakhapatnam',350,6,2,450,2650), edge('visakhapatnam','bhubaneswar',445,8,2,500,3350), edge('bhubaneswar','chennai',1200,20,1,1100,9000),
  edge('bangalore','mysore',145,3,2,150,1100), edge('bangalore','chennai',350,6,3,400,2650), edge('bangalore','pondicherry',310,6,2,350,2350),
  edge('mysore','goa',600,11,1,550,4500), edge('chennai','pondicherry',155,3,2,180,1200),
]

const neighbors = (id: string) => roads.flatMap((road) => road.from === id ? [{ ...road, from: road.from, to: road.to }] : road.to === id ? [{ ...road, from: road.to, to: road.from }] : [])
const city = (id: string) => cities.find((item) => item.id === id)!
const haversine = (a: City, b: City) => { const r = 6371; const dLat = (b.lat-a.lat)*Math.PI/180; const dLng = (b.lng-a.lng)*Math.PI/180; const q = Math.sin(dLat/2)**2 + Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(dLng/2)**2; return 2*r*Math.asin(Math.sqrt(q)) }
const weights = (priority: Priority) => ({ fastest: [0.1, 0.65, 0.05, 0.2], cheapest: [0.1, 0.1, 0.55, 0.25], shortest: [0.7, 0.15, 0.05, 0.1], traffic: [0.1, 0.2, 0.1, 0.6], balanced: [0.3, 0.3, 0.2, 0.2] }[priority])
const roadScore = (road: Road, priority: Priority) => { const [d,t,c,tr] = weights(priority); return road.distance/1000*d + road.hours/20*t + (road.toll+road.fuel)/10000*c + road.traffic/3*tr }
const heuristic = (from: string, to: string, priority: Priority) => haversine(city(from), city(to))/1000 * weights(priority)[0]

export function searchRoute(start: string, goal: string, priority: Priority, algorithm: 'astar' | 'dijkstra' = 'astar'): RouteResult {
  const open = [start]; const g = new Map([[start, 0]]); const came = new Map<string, { node: string; road: Road }>(); let explored = 0
  while (open.length) {
    open.sort((a,b) => (g.get(a)! + (algorithm === 'astar' ? heuristic(a, goal, priority) : 0)) - (g.get(b)! + (algorithm === 'astar' ? heuristic(b, goal, priority) : 0)))
    const current = open.shift()!; explored++
    if (current === goal) break
    for (const road of neighbors(current)) { const nextCost = g.get(current)! + roadScore(road, priority); if (!g.has(road.to) || nextCost < g.get(road.to)!) { g.set(road.to, nextCost); came.set(road.to, { node: current, road }); if (!open.includes(road.to)) open.push(road.to) } }
  }
  const path = [goal]; const foundRoads: Road[] = []; let cursor = goal
  while (cursor !== start && came.has(cursor)) { const previous = came.get(cursor)!; foundRoads.unshift(previous.road); path.unshift(previous.node); cursor = previous.node }
  const distance = foundRoads.reduce((s,r)=>s+r.distance,0); const hours = foundRoads.reduce((s,r)=>s+r.hours,0); const toll = foundRoads.reduce((s,r)=>s+r.toll,0); const fuel = foundRoads.reduce((s,r)=>s+r.fuel,0)
  return { path, roads: foundRoads, distance, hours, toll, fuel, cost: toll+fuel, traffic: foundRoads.length ? Math.round(foundRoads.reduce((s,r)=>s+r.traffic,0)/foundRoads.length) : 0, explored, score: g.get(goal) ?? Infinity }
}

export const cityName = (id: string) => city(id).name
export const trafficLabel = (value: number) => value <= 1 ? 'Low' : value >= 3 ? 'High' : 'Medium'
export const priorityCopy: Record<Priority, string> = { fastest: 'Time is weighted highest, with a small penalty for cost and traffic.', cheapest: 'Toll and fuel estimates lead the score while keeping distance practical.', shortest: 'Distance is the strongest signal in the route score.', traffic: 'Simulated traffic penalties guide the search toward calmer roads.', balanced: 'Distance, time, cost, and traffic are combined evenly.' }
export const formatRoute = (path: string[]) => path.map(cityName).join(' → ')
const routeFromPath = (path: string[], priority: Priority): RouteResult => {
  const foundRoads = path.slice(0, -1).map((from, index) => roads.find((road) => (road.from === from && road.to === path[index + 1]) || (road.to === from && road.from === path[index + 1]))!).filter(Boolean)
  const distance = foundRoads.reduce((sum, road) => sum + road.distance, 0)
  const hours = foundRoads.reduce((sum, road) => sum + road.hours, 0)
  const toll = foundRoads.reduce((sum, road) => sum + road.toll, 0)
  const fuel = foundRoads.reduce((sum, road) => sum + road.fuel, 0)
  return { path, roads: foundRoads, distance, hours, toll, fuel, cost: toll + fuel, traffic: foundRoads.length ? Math.round(foundRoads.reduce((sum, road) => sum + road.traffic, 0) / foundRoads.length) : 0, explored: 0, score: foundRoads.reduce((sum, road) => sum + roadScore(road, priority), 0) }
}

export const alternatives = (start: string, goal: string, priority: Priority) => {
  const paths: string[][] = []
  const visit = (current: string, path: string[]) => {
    if (paths.length >= 12) return
    if (current === goal) { paths.push(path); return }
    if (path.length > 8) return
    neighbors(current).forEach((road) => { if (!path.includes(road.to)) visit(road.to, [...path, road.to]) })
  }
  visit(start, [start])
  const recommended = searchRoute(start, goal, priority).path.join('-')
  return paths.map((path) => routeFromPath(path, priority)).filter((route) => route.path.join('-') !== recommended).sort((a, b) => a.score - b.score).filter((route, index, all) => all.findIndex((candidate) => candidate.path.join('-') === route.path.join('-')) === index).slice(0, 2)
}
export const allRoads = roads
export const allCities = cities

export function dijkstra(start: string, goal: string, priority: Priority) { return searchRoute(start, goal, priority, 'dijkstra') }

export function multiStop(stops: string[], priority: Priority) { const ordered = [stops[0]]; const remaining = stops.slice(1); while (remaining.length) { const last = ordered.at(-1)!; remaining.sort((a,b)=>haversine(city(last),city(a))-haversine(city(last),city(b))); ordered.push(remaining.shift()!) } const legs = ordered.slice(0,-1).map((from,i)=>searchRoute(from,ordered[i+1],priority)); return { ordered, legs, distance: legs.reduce((s,r)=>s+r.distance,0), hours: legs.reduce((s,r)=>s+r.hours,0), cost: legs.reduce((s,r)=>s+r.cost,0) } }

export type HistoryItem = RouteResult & { id: string; from: string; to: string; priority: Priority; createdAt: string }
const HISTORY_KEY = 'ai-smart-route-history'
export const loadHistory = (): HistoryItem[] => { if (typeof window === 'undefined') return []; try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]') } catch { return [] } }
export const saveHistory = (item: HistoryItem) => { const next = [item, ...loadHistory()].slice(0, 12); localStorage.setItem(HISTORY_KEY, JSON.stringify(next)) }

export function routeSegments(path: string[]) { return path.slice(0,-1).map((from,i)=>({from,to:path[i+1]})) }

export function routeReason(result: RouteResult, priority: Priority, budget: number, maxHours: number) { const constraints = [budget && result.cost <= budget ? `within your ₹${budget.toLocaleString('en-IN')} budget` : '', maxHours && result.hours <= maxHours ? `under your ${maxHours} hour limit` : ''].filter(Boolean).join(' and '); return `Selected for its ${priority === 'traffic' ? 'lower simulated traffic exposure' : priority === 'fastest' ? 'lower estimated travel time' : priority === 'cheapest' ? 'lower estimated travel cost' : priority === 'shortest' ? 'shorter total distance' : 'balanced trade-off across the route factors'}${constraints ? ` while remaining ${constraints}` : ''}.` }

export function isValidRoute(result: RouteResult, budget: number, maxHours: number) { return (!budget || result.cost <= budget) && (!maxHours || result.hours <= maxHours) }

export { haversine }
