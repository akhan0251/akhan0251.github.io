const flowCanvas = document.querySelector("#flow-canvas");
const flowTooltip = document.querySelector("#flow-tooltip");
const simulationRecommendations = document.querySelector("#simulation-recommendations");
const simulationResults = document.querySelector("#simulation-results");
const replicationResults = document.querySelector("#replication-results");
const simulationLog = document.querySelector("#simulation-log");
const replicationControls = document.querySelectorAll("[data-replication-control]");
const arrivalDistribution = document.querySelector("#arrival-distribution");
const interarrivalTimeField = document.querySelector("#interarrival-time-field");
const interarrivalTimeHint = document.querySelector("#interarrival-time-hint");
const arrivalStddevField = document.querySelector("#arrival-stddev-field");
const arrivalRateField = document.querySelector("#arrival-rate-field");
const arrivalRateScheduleField = document.querySelector("#arrival-rate-schedule-field");
const serviceDistribution = document.querySelector("#service-distribution");
const serviceTimeField = document.querySelector("#service-time-field");
const serviceTimeHint = document.querySelector("#service-time-hint");
const serviceStddevField = document.querySelector("#service-stddev-field");
const patternHelperResults = document.querySelector("#pattern-helper-results");
const csvFile = document.querySelector("#csv-file");
const csvArrivalColumn = document.querySelector("#csv-arrival-column");
const csvServiceColumn = document.querySelector("#csv-service-column");
const toolkitAssetBase = window.IETOOLKIT_ASSET_BASE || document.querySelector("[data-ie-toolkit-root]")?.dataset.ieToolkitRoot || "";
const defaultCsvFileName = `${toolkitAssetBase}test_911_calls_mit_sample.csv`;
const defaultSampleCsv = `entity_id,arrival_time,service_time,source_city,call_type,source_dataset
1,0.0,6.4,Seattle,911,tsdataclinic_Vera_MIT_derived_sample
2,1.6,4.8,Seattle,911,tsdataclinic_Vera_MIT_derived_sample
3,3.2,7.1,Seattle,911,tsdataclinic_Vera_MIT_derived_sample
4,5.9,5.3,Seattle,911,tsdataclinic_Vera_MIT_derived_sample
5,8.1,8.5,Seattle,911,tsdataclinic_Vera_MIT_derived_sample
6,9.4,4.6,Seattle,911,tsdataclinic_Vera_MIT_derived_sample
7,12.7,9.2,Seattle,911,tsdataclinic_Vera_MIT_derived_sample
8,14.0,5.1,Seattle,911,tsdataclinic_Vera_MIT_derived_sample
9,15.2,6.7,Seattle,911,tsdataclinic_Vera_MIT_derived_sample
10,18.6,10.4,Seattle,911,tsdataclinic_Vera_MIT_derived_sample
11,21.0,4.9,Dallas,911,tsdataclinic_Vera_MIT_derived_sample
12,21.9,6.1,Dallas,911,tsdataclinic_Vera_MIT_derived_sample
13,23.8,5.8,Dallas,911,tsdataclinic_Vera_MIT_derived_sample
14,25.5,11.3,Dallas,911,tsdataclinic_Vera_MIT_derived_sample
15,27.4,7.6,Dallas,911,tsdataclinic_Vera_MIT_derived_sample
16,29.8,4.2,Dallas,911,tsdataclinic_Vera_MIT_derived_sample
17,31.1,6.9,Dallas,911,tsdataclinic_Vera_MIT_derived_sample
18,32.6,8.8,Dallas,911,tsdataclinic_Vera_MIT_derived_sample
19,35.9,5.4,Dallas,911,tsdataclinic_Vera_MIT_derived_sample
20,38.0,12.0,Dallas,911,tsdataclinic_Vera_MIT_derived_sample
21,39.5,5.7,New Orleans,911,tsdataclinic_Vera_MIT_derived_sample
22,40.7,7.4,New Orleans,911,tsdataclinic_Vera_MIT_derived_sample
23,43.3,9.8,New Orleans,911,tsdataclinic_Vera_MIT_derived_sample
24,44.0,4.4,New Orleans,911,tsdataclinic_Vera_MIT_derived_sample
25,45.8,6.5,New Orleans,911,tsdataclinic_Vera_MIT_derived_sample
26,48.1,8.1,New Orleans,911,tsdataclinic_Vera_MIT_derived_sample
27,49.9,5.2,New Orleans,911,tsdataclinic_Vera_MIT_derived_sample
28,52.6,13.6,New Orleans,911,tsdataclinic_Vera_MIT_derived_sample
29,54.2,6.2,New Orleans,911,tsdataclinic_Vera_MIT_derived_sample
30,57.8,7.9,New Orleans,911,tsdataclinic_Vera_MIT_derived_sample
31,58.6,4.7,Detroit,911,tsdataclinic_Vera_MIT_derived_sample
32,60.3,6.8,Detroit,911,tsdataclinic_Vera_MIT_derived_sample
33,61.0,9.5,Detroit,911,tsdataclinic_Vera_MIT_derived_sample
34,63.4,5.6,Detroit,911,tsdataclinic_Vera_MIT_derived_sample
35,66.2,10.8,Detroit,911,tsdataclinic_Vera_MIT_derived_sample
36,68.0,7.2,Detroit,911,tsdataclinic_Vera_MIT_derived_sample
37,69.1,5.0,Detroit,911,tsdataclinic_Vera_MIT_derived_sample
38,72.5,12.7,Detroit,911,tsdataclinic_Vera_MIT_derived_sample
39,74.9,6.0,Detroit,911,tsdataclinic_Vera_MIT_derived_sample
40,76.2,8.4,Detroit,911,tsdataclinic_Vera_MIT_derived_sample
41,78.8,5.5,Charleston,911,tsdataclinic_Vera_MIT_derived_sample
42,80.0,6.3,Charleston,911,tsdataclinic_Vera_MIT_derived_sample
43,81.7,7.8,Charleston,911,tsdataclinic_Vera_MIT_derived_sample
44,84.6,4.9,Charleston,911,tsdataclinic_Vera_MIT_derived_sample
45,86.1,9.1,Charleston,911,tsdataclinic_Vera_MIT_derived_sample
46,87.0,6.6,Charleston,911,tsdataclinic_Vera_MIT_derived_sample
47,89.4,11.5,Charleston,911,tsdataclinic_Vera_MIT_derived_sample
48,92.8,5.8,Charleston,911,tsdataclinic_Vera_MIT_derived_sample`;

let activeAnimationFrame = null;
let currentModel = null;
let lastSimulationTime = 0;
let dragState = null;
let lastServerLayoutCount = null;
let latestPatternRecommendation = null;
let latestCsvRows = [];
let latestCsvSource = "";
let userCsvOverride = false;
let csvArrivalDataType = "arrival-times";
let selectedCapacityGosThreshold = 10;

const gosRecommendationTarget = {
  threshold: 10,
  serviceLevel: 0.8,
  maxServers: 50,
  displayWindow: 2,
};

const workday = {
  startHour: 8,
  startMinute: 0,
  duration: 540,
};

const nodeSizes = {
  flow: { width: 150, height: 76 },
  status: { width: 132, height: 66 },
};

const layout = {
  arrivals: { x: 40, y: 150 },
  queue: { x: 300, y: 150 },
  servers: { x: 580, y: 150 },
  exit: { x: 860, y: 150 },
  statusQueued: { x: 24, y: 368 },
  statusInService: { x: 168, y: 368 },
  statusCompleted: { x: 24, y: 446 },
  statusBalked: { x: 168, y: 446 },
};

function serverKey(serverId) {
  return `server-${serverId}`;
}

function resetCanvasLayout(model) {
  const canvasBounds = flowCanvas.getBoundingClientRect();
  const canvasWidth = Math.max(flowCanvas.clientWidth, canvasBounds.width, 720);
  const canvasHeight = Math.max(flowCanvas.clientHeight, canvasBounds.height, 520);
  const maxFlowX = Math.max(8, canvasWidth - nodeSizes.flow.width - 12);
  const leftX = 24;
  const queueX = clampNumber(canvasWidth * 0.28, leftX + 170, maxFlowX, 260);
  const serverX = clampNumber(canvasWidth * 0.56, queueX + 170, maxFlowX, 520);
  const exitX = clampNumber(canvasWidth - nodeSizes.flow.width - 24, serverX + 170, maxFlowX, maxFlowX);

  layout.arrivals = { x: leftX, y: 150 };
  layout.queue = { x: queueX, y: 150 };
  layout.servers = { x: serverX, y: 150 };
  layout.exit = { x: exitX, y: 150 };
  layout.statusQueued = { x: 24, y: canvasHeight - 152 };
  layout.statusInService = { x: 168, y: canvasHeight - 152 };
  layout.statusCompleted = { x: 24, y: canvasHeight - 74 };
  layout.statusBalked = { x: 168, y: canvasHeight - 74 };

  Object.keys(layout).forEach((key) => {
    if (key.startsWith("server-")) delete layout[key];
  });

  lastServerLayoutCount = null;
  if (model) ensureServerLayout(model);
}

function mean(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function standardDeviation(values) {
  if (values.length < 2) return 0;
  const average = mean(values);
  const variance = values.reduce((sum, value) => sum + (value - average) ** 2, 0) / (values.length - 1);
  return Math.sqrt(variance);
}

function formatNumber(value, digits = 3) {
  if (!Number.isFinite(value)) return "N/A";
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value);
}

function formatWorkdayTime(minutesFromStart) {
  if (!Number.isFinite(minutesFromStart)) return "-";
  const totalMinutes = workday.startHour * 60 + workday.startMinute + Math.round(minutesFromStart);
  const hours24 = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  const suffix = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12;
  return `${hours12}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

function clampNumber(value, min, max, fallback) {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}

function gradeOfService(entity) {
  if (entity.status === "balked") return "Balked";
  if (entity.wait <= 10) return "Handled within 10 min";
  if (entity.wait <= 20) return "Handled within 20 min";
  if (entity.wait <= 30) return "Handled within 30 min";
  return "Over 30 min";
}

function serviceLevel(entities, threshold) {
  if (!entities.length) return 0;
  return entities.filter((entity) => entity.wait <= threshold).length / entities.length;
}

function demandServiceLevel(model, threshold) {
  if (!model.entities.length) return 0;
  return model.entities.filter((entity) => entity.status === "completed" && entity.wait <= threshold).length / model.entities.length;
}

function createRandom(seed) {
  let state = Math.max(1, Math.trunc(seed)) % 2147483647;
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

function randomExponential(random, meanValue) {
  return -Math.log(1 - random()) * meanValue;
}

function randomStandardNormal(random) {
  const first = Math.max(random(), Number.EPSILON);
  const second = random();
  return Math.sqrt(-2 * Math.log(first)) * Math.cos(2 * Math.PI * second);
}

function randomNormal(random, meanValue, standardDeviation) {
  return Math.max(0.1, meanValue + randomStandardNormal(random) * standardDeviation);
}

function randomLognormal(random, meanValue, standardDeviation) {
  const variance = standardDeviation ** 2;
  const sigmaSquared = Math.log(1 + variance / Math.max(Number.EPSILON, meanValue ** 2));
  const sigma = Math.sqrt(Math.max(Number.EPSILON, sigmaSquared));
  const mu = Math.log(Math.max(0.1, meanValue)) - sigmaSquared / 2;
  return Math.max(0.1, Math.exp(mu + randomStandardNormal(random) * sigma));
}

function randomUniform(random, meanValue, standardDeviation) {
  const halfRange = Math.sqrt(3) * standardDeviation;
  const minValue = Math.max(0.1, meanValue - halfRange);
  const maxValue = Math.max(minValue + 0.1, meanValue + halfRange);
  return minValue + random() * (maxValue - minValue);
}

function sampleDuration(random, distribution, meanValue, standardDeviation = 0) {
  if (distribution === "exponential") return Math.max(0.1, randomExponential(random, meanValue));
  if (distribution === "poisson-rate") return Math.max(0.1, randomExponential(random, meanValue));
  if (distribution === "normal") return randomNormal(random, meanValue, standardDeviation);
  if (distribution === "lognormal") return randomLognormal(random, meanValue, standardDeviation);
  if (distribution === "uniform") return randomUniform(random, meanValue, standardDeviation);
  return meanValue;
}

function minutesPerArrival(arrivalsPerHour) {
  return 60 / Math.max(0.1, arrivalsPerHour);
}

function arrivalsPerHour(meanInterarrival) {
  return 60 / Math.max(0.1, meanInterarrival);
}

function parseArrivalRateSchedule(text) {
  const windows = String(text || "")
    .split(",")
    .map((part) => {
      const [range, rateText] = part.split(":");
      if (!range || !rateText) return null;
      const [startText, endText] = range.split("-");
      const start = Number(startText);
      const end = Number(endText);
      const rate = Number(rateText);
      if (!Number.isFinite(start) || !Number.isFinite(end) || !Number.isFinite(rate) || end <= start || rate <= 0) return null;
      return { start, end, rate };
    })
    .filter(Boolean)
    .sort((left, right) => left.start - right.start);

  return windows.length ? windows : [{ start: 0, end: 60, rate: 30 }];
}

function rateAtTime(schedule, time) {
  const matchingWindow = schedule.find((window) => time >= window.start && time < window.end);
  return matchingWindow ? matchingWindow.rate : schedule[schedule.length - 1].rate;
}

function sampleInterarrival(random, config, currentTime) {
  if (config.arrivalDistribution === "poisson-rate") {
    return Math.max(0.1, randomExponential(random, minutesPerArrival(config.arrivalRate)));
  }

  if (config.arrivalDistribution === "time-varying-rate") {
    return Math.max(0.1, randomExponential(random, minutesPerArrival(rateAtTime(config.arrivalRateSchedule, currentTime))));
  }

  return sampleDuration(random, config.arrivalDistribution, config.interarrival, config.arrivalStddev);
}

function pickQueuedEntity(queue, queueType, random) {
  if (queueType === "lifo") return queue.pop();

  if (queueType === "spt" || queueType === "lpt") {
    const direction = queueType === "spt" ? 1 : -1;
    let selectedIndex = 0;
    queue.forEach((entity, index) => {
      const current = entity.serviceDuration * direction;
      const selected = queue[selectedIndex].serviceDuration * direction;
      if (current < selected || (current === selected && entity.arrival < queue[selectedIndex].arrival)) {
        selectedIndex = index;
      }
    });
    return queue.splice(selectedIndex, 1)[0];
  }

  if (queueType === "random") return queue.splice(Math.floor(random() * queue.length), 1)[0];
  return queue.shift();
}

function assignQueuedEntity(queue, server, time, queueType, random) {
  if (!queue.length) return false;
  const entity = pickQueuedEntity(queue, queueType, random);
  entity.serviceStart = time;
  entity.departure = time + entity.serviceDuration;
  entity.wait = entity.serviceStart - entity.arrival;
  entity.total = entity.departure - entity.arrival;
  entity.serverId = server.id;
  entity.status = "completed";
  server.availableAt = entity.departure;
  server.busyTime += entity.serviceDuration;
  return true;
}

function buildSimulation(config) {
  const random = createRandom(config.seed);
  const servers = Array.from({ length: config.serverCount }, (_, index) => ({
    id: index + 1,
    availableAt: 0,
    busyTime: 0,
  }));
  const entities = [];
  const queue = [];
  let arrival = 0;

  for (let index = 0; index < config.entityCount; index += 1) {
    if (index > 0) arrival += sampleInterarrival(random, config, arrival);
    if (arrival >= workday.duration) break;

    servers
      .filter((server) => server.availableAt <= arrival)
      .sort((left, right) => left.availableAt - right.availableAt || left.id - right.id)
      .forEach((server) => {
        while (server.availableAt <= arrival && queue.length) {
          assignQueuedEntity(queue, server, server.availableAt, config.queueType, random);
        }
      });

    const entity = {
      id: index + 1,
      arrival,
      serviceStart: null,
      departure: null,
      wait: 0,
      total: 0,
      serviceDuration: sampleDuration(random, config.serviceDistribution, config.service, config.serviceStddev),
      serverId: null,
      status: "waiting",
    };

    const idleServer = servers
      .filter((server) => server.availableAt <= arrival)
      .sort((left, right) => left.availableAt - right.availableAt || left.id - right.id)[0];

    if (idleServer) {
      entity.serviceStart = arrival;
      entity.departure = arrival + entity.serviceDuration;
      entity.total = entity.serviceDuration;
      entity.serverId = idleServer.id;
      entity.status = "completed";
      idleServer.availableAt = entity.departure;
      idleServer.busyTime += entity.serviceDuration;
      entities.push(entity);
    } else if (queue.length < config.queueCapacity) {
      queue.push(entity);
      entities.push(entity);
    } else {
      entity.serviceDuration = 0;
      entity.status = "balked";
      entities.push(entity);
    }
  }

  while (queue.length) {
    const nextServer = [...servers].sort((left, right) => left.availableAt - right.availableAt || left.id - right.id)[0];
    assignQueuedEntity(queue, nextServer, nextServer.availableAt, config.queueType, random);
  }

  const completed = entities.filter((entity) => entity.status === "completed");
  const lastDeparture = completed.length ? Math.max(...completed.map((entity) => entity.departure)) : arrival;
  const horizon = Math.max(lastDeparture, arrival, workday.duration) + 1;
  const maxQueueLength = calculateMaxQueueLength(completed);
  return { entities, servers, horizon, maxQueueLength };
}

function calculateMaxQueueLength(entities) {
  const eventTimes = [...new Set(entities.flatMap((entity) => [entity.arrival, entity.serviceStart]))].sort((left, right) => left - right);
  return eventTimes.reduce((maxQueue, time) => {
    const queueLength = entities.filter((entity) => entity.arrival <= time && entity.serviceStart > time).length;
    return Math.max(maxQueue, queueLength);
  }, 0);
}

function getSimulationConfig() {
  return {
    entityCount: Math.trunc(clampNumber(Number(document.querySelector("#entity-count").value), 1, 2000, 500)),
    serverCount: Math.trunc(clampNumber(Number(document.querySelector("#server-count").value), 1, 50, 1)),
    queueCapacity: Math.trunc(clampNumber(Number(document.querySelector("#queue-capacity").value), 0, 50, 20)),
    queueType: document.querySelector("#queue-type").value,
    arrivalDistribution: document.querySelector("#arrival-distribution").value,
    interarrival: clampNumber(Number(document.querySelector("#interarrival-time").value), 0.1, 1000, 1.4),
    arrivalStddev: clampNumber(Number(document.querySelector("#arrival-stddev").value), 0.1, 1000, 0.4),
    arrivalRate: clampNumber(Number(document.querySelector("#arrival-rate").value), 0.1, 10000, 30),
    arrivalRateSchedule: parseArrivalRateSchedule(document.querySelector("#arrival-rate-schedule").value),
    serviceDistribution: document.querySelector("#service-distribution").value,
    service: clampNumber(Number(document.querySelector("#service-time").value), 0.1, 1000, 2),
    serviceStddev: clampNumber(Number(document.querySelector("#service-stddev").value), 0.1, 1000, 0.4),
    seed: Math.trunc(clampNumber(Number(document.querySelector("#sim-seed").value), 1, 999999999, 42)),
  };
}

function evaluateServerCapacity(config) {
  const options = [];
  for (let serverCount = 1; serverCount <= gosRecommendationTarget.maxServers; serverCount += 1) {
    const candidateConfig = { ...config, serverCount };
    const candidateModel = buildSimulation(candidateConfig);
    const completed = candidateModel.entities.filter((entity) => entity.status === "completed");
    const balked = candidateModel.entities.filter((entity) => entity.status === "balked");
    const averageWait = mean(completed.map((entity) => entity.wait));
    const utilization = candidateModel.servers.reduce((sum, server) => sum + server.busyTime, 0) / (candidateModel.horizon * candidateModel.servers.length);

    options.push({
      serverCount,
      gos10: demandServiceLevel(candidateModel, 10),
      gos20: demandServiceLevel(candidateModel, 20),
      gos30: demandServiceLevel(candidateModel, 30),
      hourlyGos10: hourlyGos(candidateModel, 10),
      hourlyGos20: hourlyGos(candidateModel, 20),
      hourlyGos30: hourlyGos(candidateModel, 30),
      balked: balked.length,
      averageWait,
      utilization,
      hourlyUtilization: hourlyUtilization(candidateModel),
      targetMet: demandServiceLevel(candidateModel, gosRecommendationTarget.threshold) >= gosRecommendationTarget.serviceLevel,
    });
  }

  return options;
}

function recommendServerCount(capacityOptions, threshold = gosRecommendationTarget.threshold) {
  const gosKey = `gos${threshold}`;
  const firstTargetMet = capacityOptions.find((option) => option[gosKey] >= gosRecommendationTarget.serviceLevel);
  return firstTargetMet ? { ...firstTargetMet, targetMet: true } : { ...capacityOptions[capacityOptions.length - 1], targetMet: false };
}

function capacityOptionsToDisplay(capacityOptions, recommendation) {
  const window = gosRecommendationTarget.displayWindow;
  const start = Math.max(1, recommendation.serverCount - window);
  const end = Math.min(gosRecommendationTarget.maxServers, recommendation.serverCount + window);
  return capacityOptions.filter((option) => option.serverCount >= start && option.serverCount <= end);
}

function hourlyGos(model, threshold) {
  const bucketCount = Math.max(1, Math.ceil(workday.duration / 60));
  return Array.from({ length: bucketCount }, (_, index) => {
    const start = index * 60;
    const end = start + 60;
    const entities = model.entities.filter((entity) => entity.arrival >= start && entity.arrival < end);
    const handledWithinTarget = entities.filter((entity) => entity.status === "completed" && entity.wait <= threshold).length;
    return {
      label: `${formatWorkdayTime(start)}-${formatWorkdayTime(end)}`,
      gos: entities.length ? handledWithinTarget / entities.length : null,
      arrivals: entities.length,
    };
  });
}

function serviceOverlap(entity, start, end) {
  if (entity.status !== "completed" || entity.serviceStart === null || entity.departure === null) return 0;
  return Math.max(0, Math.min(entity.departure, end) - Math.max(entity.serviceStart, start));
}

function hourlyUtilization(model) {
  const bucketCount = Math.max(1, Math.ceil(workday.duration / 60));
  return Array.from({ length: bucketCount }, (_, index) => {
    const start = index * 60;
    const end = Math.min(start + 60, workday.duration);
    const busyMinutes = model.entities.reduce((sum, entity) => sum + serviceOverlap(entity, start, end), 0);
    const availableMinutes = Math.max(1, (end - start) * model.servers.length);

    return {
      label: `${formatWorkdayTime(start)}-${formatWorkdayTime(end)}`,
      utilization: busyMinutes / availableMinutes,
      busyMinutes,
    };
  });
}

function renderMetric(label, value, className = "", detail = "") {
  const metric = document.createElement("div");
  metric.className = `metric ${className}`.trim();
  metric.innerHTML = `<strong>${value}</strong><span>${label}</span>${detail ? `<small>${detail}</small>` : ""}`;
  simulationResults.append(metric);
}

function modelMetrics(model) {
  const completed = model.entities.filter((entity) => entity.status === "completed");
  const balked = model.entities.filter((entity) => entity.status === "balked");
  const utilization = model.servers.reduce((sum, server) => sum + server.busyTime, 0) / (model.horizon * model.servers.length);

  return {
    arrivals: model.entities.length,
    completed: completed.length,
    balked: balked.length,
    averageWait: mean(completed.map((entity) => entity.wait)),
    averageSystemTime: mean(completed.map((entity) => entity.total)),
    completedWithin10: serviceLevel(completed, 10),
    completedWithin20: serviceLevel(completed, 20),
    completedWithin30: serviceLevel(completed, 30),
    gos10: demandServiceLevel(model, 10),
    gos20: demandServiceLevel(model, 20),
    gos30: demandServiceLevel(model, 30),
    utilization,
    maxQueueLength: model.maxQueueLength,
  };
}

function renderCapacityGuidance(config, capacityOptions, recommendation) {
  const targetPercent = formatNumber(gosRecommendationTarget.serviceLevel * 100, 0);
  const selectedGosKey = `gos${selectedCapacityGosThreshold}`;
  const recommendedPercent = formatNumber(recommendation[selectedGosKey] * 100, 1);
  const recommendationClass = recommendation.targetMet ? "metric-recommendation" : "metric-warning";
  const recommendationLabel = recommendation.targetMet ? `${recommendation.serverCount}` : `${recommendation.serverCount}+`;
  const evaluatedMaxServers = capacityOptions.length ? capacityOptions[capacityOptions.length - 1].serverCount : gosRecommendationTarget.maxServers;
  const displayOptions = capacityOptionsToDisplay(capacityOptions, recommendation);
  const displayStart = displayOptions.length ? displayOptions[0].serverCount : 1;
  const displayEnd = displayOptions.length ? displayOptions[displayOptions.length - 1].serverCount : 1;
  const hourlyGosKey = `hourlyGos${selectedCapacityGosThreshold}`;
  const hourlyBuckets = displayOptions.reduce((longest, option) => (
    option[hourlyGosKey].length > longest.length ? option[hourlyGosKey] : longest
  ), []);
  const hourlyHeaders = hourlyBuckets.map((bucket) => (
    `<th title="Hourly Grade of Service and server utilization for ${bucket.label}. Green means GOS meets the ${targetPercent}% target within ${selectedCapacityGosThreshold} minutes; red means below target.">${bucket.label}</th>`
  )).join("");
  const gosToggleButtons = [10, 20, 30].map((threshold) => (
    `<button class="capacity-gos-toggle ${threshold === selectedCapacityGosThreshold ? "active" : ""}" type="button" data-capacity-gos-threshold="${threshold}" aria-pressed="${threshold === selectedCapacityGosThreshold}" title="Show hourly Grade of Service using the ${threshold}-minute handling target.">${threshold} min</button>`
  )).join("");

  simulationRecommendations.innerHTML = `
    <div class="capacity-summary ${recommendationClass}">
      <div>
        <span>Recommended servers</span>
        <strong>${recommendationLabel}</strong>
        <p>
          ${recommendation.targetMet
            ? `Smallest server count that meets >= ${targetPercent}% GOS within ${selectedCapacityGosThreshold} min.`
            : `Even ${evaluatedMaxServers} servers is below the ${targetPercent}% GOS target within ${selectedCapacityGosThreshold} min.`}
          Estimated GOS: ${recommendedPercent}%.
        </p>
      </div>
      <button type="button" data-apply-server-count="${recommendation.serverCount}" title="Update the simulator Servers input to ${recommendation.serverCount} and redraw the scenario.">
        Use ${recommendation.serverCount} server${recommendation.serverCount === 1 ? "" : "s"}
      </button>
    </div>

    <div class="capacity-toolbar" aria-label="Capacity guidance options">
      <span>Hourly GOS target</span>
      <div class="capacity-gos-toggle-group">
        ${gosToggleButtons}
      </div>
      <small>Showing ${gosRecommendationTarget.displayWindow} below and ${gosRecommendationTarget.displayWindow} above the recommendation: ${displayStart}-${displayEnd} servers.</small>
    </div>

    <div class="capacity-table-wrap">
      <table class="capacity-table">
        <thead>
          <tr>
            <th title="Staffing level tested for this row.">Servers</th>
            <th title="Percent of all generated arrivals handled within 10 minutes for this staffing level.">GOS 10 min</th>
            <th title="Percent of all generated arrivals handled within 20 minutes for this staffing level.">GOS 20 min</th>
            <th title="Percent of all generated arrivals handled within 30 minutes for this staffing level.">GOS 30 min</th>
            ${hourlyHeaders}
            <th title="Number of arrivals that were lost because the queue was full.">Balked</th>
            <th title="Average wait time, in minutes, before service starts for completed entities.">Avg wait</th>
            <th title="Average percent of server capacity used across the simulated day.">Utilization</th>
            <th title="Apply this staffing level to the simulator.">Action</th>
          </tr>
        </thead>
        <tbody>
          ${displayOptions.map((option) => `
            <tr class="${option.serverCount === config.serverCount ? "current-capacity-row" : ""} ${option.serverCount === recommendation.serverCount ? "recommended-capacity-row" : ""}">
              <td title="${option.serverCount} server${option.serverCount === 1 ? "" : "s"} tested in this capacity scenario.">
                <strong>${option.serverCount}</strong>
                ${option.serverCount === config.serverCount ? `<em>Current</em>` : ""}
                ${option.serverCount === recommendation.serverCount ? `<em>Recommended</em>` : ""}
              </td>
              <td title="${formatNumber(option.gos10 * 100, 1)}% of all arrivals were handled within 10 minutes with ${option.serverCount} server${option.serverCount === 1 ? "" : "s"}.">${formatNumber(option.gos10 * 100, 1)}%</td>
              <td title="${formatNumber(option.gos20 * 100, 1)}% of all arrivals were handled within 20 minutes with ${option.serverCount} server${option.serverCount === 1 ? "" : "s"}.">${formatNumber(option.gos20 * 100, 1)}%</td>
              <td title="${formatNumber(option.gos30 * 100, 1)}% of all arrivals were handled within 30 minutes with ${option.serverCount} server${option.serverCount === 1 ? "" : "s"}.">${formatNumber(option.gos30 * 100, 1)}%</td>
              ${hourlyBuckets.map((bucket, index) => {
                const hour = option[hourlyGosKey][index];
                const utilization = option.hourlyUtilization[index];
                const hourlyPercent = hour && hour.gos !== null ? `${formatNumber(hour.gos * 100, 0)}%` : "No arrivals";
                const hourlyUtilizationPercent = utilization ? `${formatNumber(utilization.utilization * 100, 0)}%` : "-";
                const hourlyStatus = hour && hour.gos !== null && hour.gos >= gosRecommendationTarget.serviceLevel ? "meets" : "is below";
                const hourlyTooltip = hour && hour.gos !== null
                  ? `${bucket.label}: ${hourlyPercent} of ${hour.arrivals} arrivals were handled within ${selectedCapacityGosThreshold} minutes. This ${hourlyStatus} the ${targetPercent}% target. Server utilization was ${hourlyUtilizationPercent}.`
                  : `${bucket.label}: no arrivals were generated in this hour. Server utilization was ${hourlyUtilizationPercent}.`;
                return `<td class="hourly-gos-cell ${hour && hour.gos !== null && hour.gos >= gosRecommendationTarget.serviceLevel ? "hourly-gos-good" : "hourly-gos-risk"}" title="${hourlyTooltip}">
                  ${hour && hour.gos !== null ? `${formatNumber(hour.gos * 100, 0)}%` : "-"}
                  ${hour && hour.arrivals ? `<small>${hour.arrivals} arrivals</small>` : ""}
                  <small class="hourly-utilization-value">Util ${hourlyUtilizationPercent}</small>
                </td>`;
              }).join("")}
              <td title="${option.balked} arrivals were lost because the queue was full with ${option.serverCount} server${option.serverCount === 1 ? "" : "s"}.">${option.balked}</td>
              <td title="Average time completed entities waited before service started.">${formatNumber(option.averageWait, 2)}</td>
              <td title="Estimated average server utilization across the 8 AM-5 PM day.">${formatNumber(option.utilization * 100, 1)}%</td>
              <td><button class="secondary-button capacity-action" type="button" data-apply-server-count="${option.serverCount}" title="Set simulator Servers to ${option.serverCount}.">Use</button></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderSimulationResults(model, config) {
  const metrics = modelMetrics(model);
  const capacityOptions = evaluateServerCapacity(config);
  const recommendation = recommendServerCount(capacityOptions, selectedCapacityGosThreshold);

  renderCapacityGuidance(config, capacityOptions, recommendation);

  simulationResults.innerHTML = "";
  renderMetric("Completed", `${metrics.completed} of ${metrics.arrivals}`);
  renderMetric("Balked", `${metrics.balked}`);
  renderMetric("Average wait", formatNumber(metrics.averageWait, 2));
  renderMetric("Within 10 min", `${formatNumber(metrics.completedWithin10 * 100, 1)}%`);
  renderMetric("Within 20 min", `${formatNumber(metrics.completedWithin20 * 100, 1)}%`);
  renderMetric("Within 30 min", `${formatNumber(metrics.completedWithin30 * 100, 1)}%`);
  renderMetric("Avg. system time", formatNumber(metrics.averageSystemTime, 2));
  renderMetric("Utilization", `${formatNumber(metrics.utilization * 100, 1)}%`);
  renderMetric("Max queue", `${metrics.maxQueueLength}`);
  renderMetric("Simulated day", "8 AM-5 PM");
  renderMetric("Servers", `${model.servers.length}`);
  renderMetric("Queue type", config.queueType.toUpperCase());
}

function renderReplicationAverageMetrics(rows, config) {
  const completedMean = mean(rows.map((row) => row.completed));
  const arrivalsMean = mean(rows.map((row) => row.arrivals));
  const balkedMean = mean(rows.map((row) => row.balked));
  const averageWaitMean = mean(rows.map((row) => row.averageWait));
  const averageSystemTimeMean = mean(rows.map((row) => row.averageSystemTime));
  const gos10Mean = mean(rows.map((row) => row.gos10));
  const gos20Mean = mean(rows.map((row) => row.gos20));
  const gos30Mean = mean(rows.map((row) => row.gos30));
  const utilizationMean = mean(rows.map((row) => row.utilization));
  const maxQueueMean = mean(rows.map((row) => row.maxQueueLength));
  const detail = `Average across ${rows.length} replication${rows.length === 1 ? "" : "s"}.`;

  simulationResults.innerHTML = "";
  renderMetric("Avg completed", `${formatNumber(completedMean, 1)} of ${formatNumber(arrivalsMean, 1)}`, "", detail);
  renderMetric("Avg balked", formatNumber(balkedMean, 1), "", detail);
  renderMetric("Avg wait", formatNumber(averageWaitMean, 2), "", detail);
  renderMetric("Avg GOS 10 min", `${formatNumber(gos10Mean * 100, 1)}%`, "", detail);
  renderMetric("Avg GOS 20 min", `${formatNumber(gos20Mean * 100, 1)}%`, "", detail);
  renderMetric("Avg GOS 30 min", `${formatNumber(gos30Mean * 100, 1)}%`, "", detail);
  renderMetric("Avg system time", formatNumber(averageSystemTimeMean, 2), "", detail);
  renderMetric("Avg utilization", `${formatNumber(utilizationMean * 100, 1)}%`, "", detail);
  renderMetric("Avg max queue", formatNumber(maxQueueMean, 1), "", detail);
  renderMetric("Replications", `${rows.length}`, "", `Seeds ${config.seed}-${config.seed + rows.length - 1}.`);
  renderMetric("Servers", `${config.serverCount}`, "", "Current scenario server count.");
  renderMetric("Queue type", config.queueType.toUpperCase(), "", "Current scenario queue rule.");
}

function renderSimulationLog(entities) {
  simulationLog.innerHTML = "";
  entities.forEach((entity) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${entity.id}</td>
      <td>${formatWorkdayTime(entity.arrival)}</td>
      <td>${entity.serverId ?? "-"}</td>
      <td>${entity.serviceStart === null ? "-" : formatWorkdayTime(entity.serviceStart)}</td>
      <td>${entity.departure === null ? "-" : formatWorkdayTime(entity.departure)}</td>
      <td>${formatNumber(entity.wait, 2)}</td>
      <td>${gradeOfService(entity)}</td>
      <td>${entity.status}</td>
    `;
    simulationLog.append(row);
  });
}

function percentile(values, probability) {
  if (!values.length) return 0;
  const sorted = [...values].sort((left, right) => left - right);
  const index = (sorted.length - 1) * probability;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower);
}

function summarizeReplicationMetric(rows, key) {
  const values = rows.map((row) => row[key]).filter((value) => Number.isFinite(value));
  const average = mean(values);
  const stddev = standardDeviation(values);
  const margin = values.length > 1 ? 1.96 * stddev / Math.sqrt(values.length) : 0;

  return {
    mean: average,
    lower: average - margin,
    upper: average + margin,
    p10: percentile(values, 0.1),
    p90: percentile(values, 0.9),
    worst: Math.max(...values),
  };
}

function replicatedCapacityRecommendation(config, replicationCount, threshold = selectedCapacityGosThreshold) {
  const gosKey = `gos${threshold}`;
  const target = gosRecommendationTarget.serviceLevel;
  const reliabilityTarget = 0.9;
  const options = [];

  for (let serverCount = 1; serverCount <= gosRecommendationTarget.maxServers; serverCount += 1) {
    const rows = Array.from({ length: replicationCount }, (_, index) => {
      const model = buildSimulation({ ...config, serverCount, seed: config.seed + index });
      return modelMetrics(model);
    });
    const gosValues = rows.map((row) => row[gosKey]);
    const averageWaitValues = rows.map((row) => row.averageWait);
    const balkedValues = rows.map((row) => row.balked);
    const utilizationValues = rows.map((row) => row.utilization);
    const targetHitRate = gosValues.filter((value) => value >= target).length / rows.length;

    options.push({
      serverCount,
      targetHitRate,
      meanGos: mean(gosValues),
      meanAverageWait: mean(averageWaitValues),
      meanBalked: mean(balkedValues),
      meanUtilization: mean(utilizationValues),
      targetMet: targetHitRate >= reliabilityTarget,
    });
  }

  const recommendation = options.find((option) => option.targetMet) || options[options.length - 1];
  return {
    options,
    recommendation,
    threshold,
    target,
    reliabilityTarget,
  };
}

function formatReplicationValue(value, type) {
  if (type === "percent") return `${formatNumber(value * 100, 1)}%`;
  if (type === "count") return formatNumber(value, 0);
  return formatNumber(value, 2);
}

function boundReplicationValue(value, type) {
  if (type === "percent") return clampNumber(value, 0, 1, 0);
  if (type === "count" || type === "minutes") return Math.max(0, value);
  return value;
}

function replicatedCapacityOptionsToDisplay(capacityAnalysis) {
  const window = gosRecommendationTarget.displayWindow;
  const recommendedCount = capacityAnalysis.recommendation.serverCount;
  const start = Math.max(1, recommendedCount - window);
  const end = Math.min(gosRecommendationTarget.maxServers, recommendedCount + window);
  return capacityAnalysis.options.filter((option) => option.serverCount >= start && option.serverCount <= end);
}

function renderReplicatedCapacityGuidance(capacityAnalysis, config) {
  const displayOptions = replicatedCapacityOptionsToDisplay(capacityAnalysis);
  const targetPercent = formatNumber(capacityAnalysis.target * 100, 0);
  const reliabilityPercent = formatNumber(capacityAnalysis.reliabilityTarget * 100, 0);
  const recommendation = capacityAnalysis.recommendation;
  const recommendationLabel = recommendation.targetMet ? `${recommendation.serverCount}` : `${recommendation.serverCount}+`;
  const recommendationClass = recommendation.targetMet ? "metric-recommendation" : "metric-warning";

  return `
    <div class="replication-capacity ${recommendationClass}">
      <div>
        <span>Stochastic recommended servers</span>
        <strong>${recommendationLabel}</strong>
        <p title="Smallest server count where at least ${reliabilityPercent}% of replications meet the ${targetPercent}% GOS target within ${capacityAnalysis.threshold} minutes.">
          ${recommendation.targetMet
            ? `${formatNumber(recommendation.targetHitRate * 100, 1)}% of replications met ${targetPercent}% GOS within ${capacityAnalysis.threshold} minutes.`
            : `Even ${recommendation.serverCount} servers did not reach ${reliabilityPercent}% reliability for ${targetPercent}% GOS within ${capacityAnalysis.threshold} minutes.`}
        </p>
      </div>
    </div>
    <div class="replication-table-wrap">
      <table class="replication-table">
        <thead>
          <tr>
            <th title="Server count tested across all selected replications.">Servers</th>
            <th title="Percent of replications where GOS met or exceeded ${targetPercent}% within ${capacityAnalysis.threshold} minutes.">Runs meeting target</th>
            <th title="Average GOS across replications for this server count.">Mean GOS</th>
            <th title="Average wait time across replications.">Mean wait</th>
            <th title="Average balked arrivals across replications.">Mean balked</th>
            <th title="Average server utilization across replications.">Mean utilization</th>
          </tr>
        </thead>
        <tbody>
          ${displayOptions.map((option) => `
            <tr class="${option.serverCount === config.serverCount ? "current-capacity-row" : ""} ${option.serverCount === recommendation.serverCount ? "recommended-capacity-row" : ""}">
              <td title="${option.serverCount} server${option.serverCount === 1 ? "" : "s"} tested across stochastic replications.">
                <strong>${option.serverCount}</strong>
                ${option.serverCount === config.serverCount ? `<em>Current</em>` : ""}
                ${option.serverCount === recommendation.serverCount ? `<em>Recommended</em>` : ""}
              </td>
              <td title="${formatNumber(option.targetHitRate * 100, 1)}% of replications met the selected GOS target.">${formatNumber(option.targetHitRate * 100, 1)}%</td>
              <td title="Mean GOS across replications for this server count.">${formatNumber(option.meanGos * 100, 1)}%</td>
              <td title="Mean wait across replications for completed entities.">${formatNumber(option.meanAverageWait, 2)}</td>
              <td title="Mean number of balked arrivals across replications.">${formatNumber(option.meanBalked, 1)}</td>
              <td title="Mean utilization across replications.">${formatNumber(option.meanUtilization * 100, 1)}%</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderReplicationResults(rows, config, capacityAnalysis) {
  const metricDefinitions = [
    ["Arrivals", "arrivals", "count", "high", "Generated arrivals before the 5 PM cutoff in each replicated day."],
    ["Completed", "completed", "count", "low", "Arrivals that finished service in each replicated day."],
    ["Balked", "balked", "count", "high", "Arrivals lost because the queue was full in each replicated day."],
    ["Avg wait", "averageWait", "minutes", "high", "Average wait before service for completed entities in each replicated day."],
    ["GOS 10 min", "gos10", "percent", "low", "Share of all generated arrivals completed within 10 minutes in each replicated day."],
    ["GOS 20 min", "gos20", "percent", "low", "Share of all generated arrivals completed within 20 minutes in each replicated day."],
    ["GOS 30 min", "gos30", "percent", "low", "Share of all generated arrivals completed within 30 minutes in each replicated day."],
    ["Utilization", "utilization", "percent", "high", "Share of available server time used in each replicated day."],
    ["Max queue", "maxQueueLength", "count", "high", "Largest number of entities waiting at the same time in each replicated day."],
  ];

  const rowHtml = metricDefinitions.map(([label, key, type, riskDirection, tooltip]) => {
    const summary = summarizeReplicationMetric(rows, key);
    const values = rows.map((row) => row[key]).filter((value) => Number.isFinite(value));
    const riskCase = riskDirection === "low" ? Math.min(...values) : summary.worst;
    const riskDescription = riskDirection === "low" ? "lowest observed value" : "highest observed value";
    return `
      <tr>
        <td title="${tooltip}">${label}</td>
        <td title="Average ${label.toLowerCase()} across ${rows.length} replication${rows.length === 1 ? "" : "s"}.">${formatReplicationValue(summary.mean, type)}</td>
        <td title="Approximate 95% confidence interval for the mean. With one replication this equals the observed value.">${formatReplicationValue(boundReplicationValue(summary.lower, type), type)}-${formatReplicationValue(boundReplicationValue(summary.upper, type), type)}</td>
        <td title="10th percentile across replicated days.">${formatReplicationValue(summary.p10, type)}</td>
        <td title="90th percentile across replicated days.">${formatReplicationValue(summary.p90, type)}</td>
        <td title="Risk-case ${label.toLowerCase()}: ${riskDescription} across replicated days.">${formatReplicationValue(riskCase, type)}</td>
      </tr>
    `;
  }).join("");

  replicationResults.hidden = false;
  replicationResults.innerHTML = `
    <div class="replication-summary">
      <div>
        <span>Stochastic replications</span>
        <strong>${rows.length}</strong>
        <p title="Replications use the current scenario inputs and sequential random seeds. The stochastic server recommendation uses the same replication count.">Seeds ${config.seed}-${config.seed + rows.length - 1}. Each row is an independent full-day run of the current scenario.</p>
      </div>
    </div>
    ${renderReplicatedCapacityGuidance(capacityAnalysis, config)}
    <div class="replication-table-wrap">
      <table class="replication-table">
        <thead>
          <tr>
            <th title="Output measure summarized across replicated full-day runs.">Metric</th>
            <th title="Average value across replications.">Mean</th>
            <th title="Approximate 95% confidence interval for the mean across replications.">95% CI</th>
            <th title="10th percentile across replicated days.">P10</th>
            <th title="90th percentile across replicated days.">P90</th>
            <th title="Worst observed direction for the metric: high for congestion/cost metrics and low for service-level metrics.">Risk case</th>
          </tr>
        </thead>
        <tbody>${rowHtml}</tbody>
      </table>
    </div>
  `;
}

function clearReplicationResults() {
  replicationResults.hidden = true;
  replicationResults.innerHTML = "";
}

function needsReplication(config = getSimulationConfig()) {
  return config.arrivalDistribution !== "deterministic" || config.serviceDistribution !== "deterministic" || config.queueType === "random";
}

function updateReplicationControls(config = getSimulationConfig()) {
  const showControls = needsReplication(config);
  replicationControls.forEach((control) => {
    control.hidden = !showControls;
  });
  if (!showControls) clearReplicationResults();
}

function countsAt(model, time) {
  return {
    arrived: model.entities.filter((entity) => entity.arrival <= time).length,
    queued: model.entities.filter((entity) => entity.status === "completed" && entity.arrival <= time && entity.serviceStart > time).length,
    inService: model.entities.filter((entity) => entity.status === "completed" && entity.serviceStart <= time && entity.departure > time).length,
    completed: model.entities.filter((entity) => entity.status === "completed" && entity.departure <= time).length,
    balked: model.entities.filter((entity) => entity.status === "balked" && entity.arrival <= time).length,
  };
}

function ensureServerLayout(model) {
  const serverHeight = nodeSizes.flow.height;
  const gap = model.servers.length > 12 ? 4 : model.servers.length > 5 ? 6 : 14;
  const processRowY = layout.servers.y;
  const canvasHeight = Math.max(flowCanvas.clientHeight, flowCanvas.getBoundingClientRect().height, 520);
  const maxRows = Math.max(1, Math.floor((canvasHeight - 48 + gap) / (serverHeight + gap)));
  const columnCount = Math.max(1, Math.ceil(model.servers.length / maxRows));
  const rowsPerColumn = Math.max(1, Math.ceil(model.servers.length / columnCount));
  const totalHeight = rowsPerColumn * serverHeight + Math.max(0, rowsPerColumn - 1) * gap;
  const startY = clampNumber(processRowY - (totalHeight - serverHeight) / 2, 24, Math.max(24, canvasHeight - totalHeight - 8), processRowY);
  const columnGap = model.servers.length > 12 ? 8 : 14;
  const serverCountChanged = lastServerLayoutCount !== model.servers.length;

  model.servers.forEach((server, index) => {
    const key = serverKey(server.id);
    if (serverCountChanged || !layout[key]) {
      const column = Math.floor(index / rowsPerColumn);
      const row = index % rowsPerColumn;
      layout[key] = {
        x: layout.servers.x + column * (nodeSizes.flow.width + columnGap),
        y: startY + row * (serverHeight + gap),
      };
    }
  });

  lastServerLayoutCount = model.servers.length;
}

function nodeCenter(key) {
  const size = key.startsWith("status") ? nodeSizes.status : nodeSizes.flow;
  return { x: layout[key].x + size.width / 2, y: layout[key].y + size.height / 2 };
}

function entityPosition(entity, time) {
  let source = nodeCenter("arrivals");
  let target = nodeCenter("queue");
  const assignedServerKey = entity.serverId ? serverKey(entity.serverId) : "servers";
  let progress = 0;

  if (entity.status === "balked") {
    progress = Math.min(1, (time - entity.arrival) / 1.2);
  } else if (time < entity.serviceStart) {
    progress = Math.min(1, (time - entity.arrival) / Math.max(0.1, entity.serviceStart - entity.arrival));
  } else if (time < entity.departure) {
    source = nodeCenter("queue");
    target = nodeCenter(assignedServerKey);
    progress = (time - entity.serviceStart) / Math.max(0.1, entity.departure - entity.serviceStart);
  } else {
    source = nodeCenter(assignedServerKey);
    target = nodeCenter("exit");
    progress = Math.min(1, (time - entity.departure) / 0.9);
  }

  return {
    x: source.x + (target.x - source.x) * progress,
    y: source.y - 58 + (entity.id % 4) * 16 + (target.y - source.y) * progress,
  };
}

function tooltipForNode(id, title, detail) {
  if (id === "arrivals") return "Arrivals are the entities entering the model. The arrival pattern and mean interarrival time control how quickly demand reaches the system.";
  if (id === "queue") return "The queue holds entities while all servers are busy. Queue capacity controls balking, and queue type controls the next entity selected.";
  if (id === "exit") return "The exit node counts completed entities after service is finished.";
  if (id === "statusQueued") return "Current number of entities waiting for service at this simulation time.";
  if (id === "statusInService") return "Current number of entities actively being processed by servers.";
  if (id === "statusCompleted") return "Current number of entities that have completed service and exited the system.";
  if (id === "statusBalked") return "Current number of entities lost because the queue was full when they arrived.";
  if (id.startsWith("server-")) return `${title}: ${detail}. Servers represent the resources processing entities.`;
  return `${title}: ${detail}`;
}

function makeNode(id, className, title, detail) {
  const node = document.createElement("div");
  node.className = className;
  node.dataset.nodeId = id;
  node.dataset.tooltip = tooltipForNode(id, title, detail);
  node.style.left = `${layout[id].x}px`;
  node.style.top = `${layout[id].y}px`;
  node.innerHTML = `<strong>${title}</strong><span>${detail}</span>`;
  return node;
}

function makeEdge(fromKey, toKey) {
  const from = nodeCenter(fromKey);
  const to = nodeCenter(toKey);
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  const midX = (from.x + to.x) / 2;
  path.setAttribute("d", `M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`);
  path.setAttribute("class", "flow-edge");
  return path;
}

function renderFlow(model, time) {
  lastSimulationTime = time;
  ensureServerLayout(model);
  const counts = countsAt(model, time);
  const activeServerEntities = new Map();
  model.entities.forEach((entity) => {
    if (entity.serverId && entity.serviceStart <= time && entity.departure > time) {
      activeServerEntities.set(entity.serverId, entity);
    }
  });

  flowCanvas.innerHTML = "";
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.classList.add("flow-edges");
  svg.append(makeEdge("arrivals", "queue"));
  model.servers.forEach((server) => {
    svg.append(makeEdge("queue", serverKey(server.id)), makeEdge(serverKey(server.id), "exit"));
  });
  flowCanvas.append(svg);

  const processNodes = [
    makeNode("arrivals", "flow-node", "Arrivals", `${counts.arrived} arrived`),
    makeNode("queue", `flow-node ${counts.queued ? "flow-node-warning" : ""}`, "Queue", `${counts.queued} waiting`),
    makeNode("exit", "flow-node flow-node-success", "Exit", `${counts.completed} complete`),
  ];

  model.servers.forEach((server) => {
    const activeEntity = activeServerEntities.get(server.id);
    processNodes.push(
      makeNode(
        serverKey(server.id),
        `flow-node server-node ${activeEntity ? "flow-node-success" : ""}`,
        `Server ${server.id}`,
        activeEntity ? `Working on entity ${activeEntity.id}` : "Idle"
      )
    );
  });

  flowCanvas.append(
    ...processNodes,
    makeNode("statusQueued", "status-node", "Queued", counts.queued),
    makeNode("statusInService", "status-node status-node-warning", "In service", counts.inService),
    makeNode("statusCompleted", "status-node status-node-success", "Completed", counts.completed),
    makeNode("statusBalked", "status-node status-node-danger", "Balked", counts.balked)
  );

  model.entities.forEach((entity) => {
    if (time < entity.arrival) return;
    if (entity.status === "balked" && time > entity.arrival + 1.2) return;
    if (entity.departure !== null && time > entity.departure + 0.9) return;

    const position = entityPosition(entity, time);
    const chip = document.createElement("div");
    chip.className = `entity-node ${entity.status === "balked" ? "entity-node-balked" : ""}`;
    chip.textContent = entity.id;
    chip.style.left = `${position.x}px`;
    chip.style.top = `${position.y}px`;
    flowCanvas.append(chip);
  });
}

function stopSimulation() {
  if (activeAnimationFrame !== null) {
    cancelAnimationFrame(activeAnimationFrame);
    activeAnimationFrame = null;
  }
}

function runSimulation() {
  stopSimulation();
  clearReplicationResults();
  const config = getSimulationConfig();
  updateReplicationControls(config);
  const speed = clampNumber(Number(document.querySelector("#sim-speed").value), 0.5, 5, 2);
  currentModel = buildSimulation(config);
  resetCanvasLayout(currentModel);
  const startedAt = performance.now();

  renderSimulationResults(currentModel, config);
  renderSimulationLog(currentModel.entities);

  function animate(now) {
    const elapsed = ((now - startedAt) / 1000) * speed;
    renderFlow(currentModel, elapsed);
    if (elapsed < currentModel.horizon) activeAnimationFrame = requestAnimationFrame(animate);
    else activeAnimationFrame = null;
  }

  activeAnimationFrame = requestAnimationFrame(animate);
}

function runFullDaySimulation() {
  stopSimulation();
  clearReplicationResults();
  const config = getSimulationConfig();
  updateReplicationControls(config);
  currentModel = buildSimulation(config);
  resetCanvasLayout(currentModel);
  renderSimulationResults(currentModel, config);
  renderSimulationLog(currentModel.entities);
  renderFlow(currentModel, workday.duration);
}

function runReplications() {
  stopSimulation();
  const config = getSimulationConfig();
  if (!needsReplication(config)) {
    clearReplicationResults();
    updateReplicationControls(config);
    return;
  }
  updateReplicationControls(config);
  const replicationCount = Math.trunc(clampNumber(Number(document.querySelector("#replication-count").value), 1, 500, 1));
  document.querySelector("#replication-count").value = replicationCount;

  const rows = Array.from({ length: replicationCount }, (_, index) => {
    const model = buildSimulation({ ...config, seed: config.seed + index });
    return modelMetrics(model);
  });
  const capacityAnalysis = replicatedCapacityRecommendation(config, replicationCount, selectedCapacityGosThreshold);

  currentModel = buildSimulation(config);
  resetCanvasLayout(currentModel);
  renderSimulationResults(currentModel, config);
  renderReplicationAverageMetrics(rows, config);
  renderSimulationLog(currentModel.entities);
  renderFlow(currentModel, workday.duration);
  renderReplicationResults(rows, config, capacityAnalysis);
}

function resetSimulation() {
  stopSimulation();
  clearReplicationResults();
  const config = getSimulationConfig();
  updateReplicationControls(config);
  currentModel = buildSimulation(config);
  resetCanvasLayout(currentModel);
  renderSimulationResults(currentModel, config);
  renderSimulationLog(currentModel.entities);
  renderFlow(currentModel, 0);
}

function reorganizeCanvas() {
  stopSimulation();
  clearReplicationResults();
  const config = getSimulationConfig();
  updateReplicationControls(config);
  currentModel = buildSimulation(config);
  resetCanvasLayout(currentModel);
  renderSimulationResults(currentModel, config);
  renderSimulationLog(currentModel.entities);
  renderFlow(currentModel, 0);
}

function switchTab(targetId) {
  document.querySelectorAll(".tab-button").forEach((button) => {
    const isActive = button.dataset.tabTarget === targetId;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  document.querySelectorAll(".tab-panel").forEach((panel) => {
    panel.hidden = panel.id !== targetId;
  });

  if (targetId === "simulator-tab" && currentModel) {
    renderFlow(currentModel, lastSimulationTime);
  }
}

function setupTabs() {
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.addEventListener("click", () => switchTab(button.dataset.tabTarget));
  });

  switchTab("simulator-tab");
}

function updateArrivalControls() {
  const pattern = arrivalDistribution.value;
  const usesStddev = pattern === "normal" || pattern === "lognormal" || pattern === "uniform";
  const usesArrivalRate = pattern === "poisson-rate";
  const usesRateSchedule = pattern === "time-varying-rate";
  arrivalStddevField.hidden = !usesStddev;
  arrivalRateField.hidden = !usesArrivalRate;
  arrivalRateScheduleField.hidden = !usesRateSchedule;
  interarrivalTimeField.hidden = usesArrivalRate || usesRateSchedule;

  if (pattern === "deterministic") {
    interarrivalTimeField.firstChild.textContent = "Interarrival time";
    interarrivalTimeHint.textContent = "Fixed time between each entity arrival.";
  } else if (pattern === "exponential") {
    interarrivalTimeField.firstChild.textContent = "Mean interarrival";
    interarrivalTimeHint.textContent = "Average time between arrivals for the exponential pattern.";
  } else if (pattern === "poisson-rate") {
    interarrivalTimeHint.textContent = "Converted from calls per hour to exponential interarrival times.";
  } else if (pattern === "time-varying-rate") {
    interarrivalTimeHint.textContent = "Uses a schedule of calls per hour to create time-varying exponential arrivals.";
  } else if (pattern === "uniform") {
    interarrivalTimeField.firstChild.textContent = "Mean interarrival";
    interarrivalTimeHint.textContent = "Center point for uniformly distributed interarrival times.";
  } else {
    interarrivalTimeField.firstChild.textContent = "Mean interarrival";
    interarrivalTimeHint.textContent = `Average time between arrivals for the ${patternLabel(pattern).toLowerCase()} pattern.`;
  }
}

function updateServiceControls() {
  const pattern = serviceDistribution.value;
  const usesStddev = pattern === "normal" || pattern === "lognormal" || pattern === "uniform";
  serviceStddevField.hidden = !usesStddev;

  if (pattern === "deterministic") {
    serviceTimeField.firstChild.textContent = "Service time";
    serviceTimeHint.textContent = "Fixed processing time for every entity.";
  } else if (pattern === "exponential") {
    serviceTimeField.firstChild.textContent = "Mean service time";
    serviceTimeHint.textContent = "Average processing time used for exponential service.";
  } else if (pattern === "uniform") {
    serviceTimeField.firstChild.textContent = "Mean service time";
    serviceTimeHint.textContent = "Center point for uniformly distributed service times.";
  } else {
    serviceTimeField.firstChild.textContent = "Mean service time";
    serviceTimeHint.textContent = `Average processing time used for ${patternLabel(pattern).toLowerCase()} service.`;
  }
}

function handleArrivalDistributionChange() {
  updateArrivalControls();
  updateReplicationControls();
  clearReplicationResults();
}

function handleServiceDistributionChange() {
  updateServiceControls();
  updateReplicationControls();
  clearReplicationResults();
}

function handleQueueTypeChange() {
  updateReplicationControls();
  clearReplicationResults();
}

function parseCsvRows(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const nextChar = text[index + 1];

    if (char === '"' && inQuotes && nextChar === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      row.push(cell.trim());
      cell = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && nextChar === "\n") index += 1;
      row.push(cell.trim());
      if (row.some((value) => value !== "")) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  row.push(cell.trim());
  if (row.some((value) => value !== "")) rows.push(row);
  return rows;
}

function populateCsvColumnSelects(headers) {
  const options = headers.map((header, index) => `<option value="${index}">${header || `Column ${index + 1}`}</option>`).join("");
  csvArrivalColumn.innerHTML = options;
  csvServiceColumn.innerHTML = options;

  const normalizedHeaders = headers.map((header) => header.toLowerCase().replace(/[^a-z0-9]/g, ""));
  const arrivalIndex = normalizedHeaders.findIndex((header) => header === "arrivaltime" || header === "arrival" || header === "time");
  const interarrivalIndex = normalizedHeaders.findIndex((header) => header === "interarrivaltime" || header === "interarrival");
  const serviceIndex = normalizedHeaders.findIndex((header) => header === "servicetime" || header === "service" || header === "processingtime");

  if (arrivalIndex >= 0) {
    csvArrivalColumn.value = String(arrivalIndex);
    csvArrivalDataType = "arrival-times";
  } else if (interarrivalIndex >= 0) {
    csvArrivalColumn.value = String(interarrivalIndex);
    csvArrivalDataType = "interarrival-times";
  }

  if (serviceIndex >= 0) {
    csvServiceColumn.value = String(serviceIndex);
  } else {
    csvServiceColumn.selectedIndex = Math.min(1, headers.length - 1);
  }
}

function loadCsvText(text, sourceName) {
  const rows = parseCsvRows(String(text || ""));
  if (rows.length < 2) {
    latestCsvRows = [];
    latestCsvSource = "";
    patternHelperResults.innerHTML = renderHelperCard("CSV import", "Need more rows", [["Rows found", rows.length]], "Load a CSV with a header row and at least one data row.");
    return false;
  }

  latestCsvRows = rows;
  latestCsvSource = sourceName || "Loaded CSV";
  populateCsvColumnSelects(rows[0]);
  loadCsvColumns();
  return true;
}

function readCsvFile() {
  const file = csvFile.files[0];
  if (!file) return;
  userCsvOverride = true;

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    loadCsvText(String(reader.result || ""), file.name);
  });
  reader.readAsText(file);
}

function loadDefaultSampleCsv(force = false) {
  if (window.location.protocol === "file:") {
    if (force || !userCsvOverride) loadCsvText(defaultSampleCsv, `${defaultCsvFileName} (bundled test sample)`);
    return;
  }

  fetch(defaultCsvFileName)
    .then((response) => {
      if (!response.ok) throw new Error(`Could not load ${defaultCsvFileName}`);
      return response.text();
    })
    .then((text) => {
      if (force || !userCsvOverride) loadCsvText(text, defaultCsvFileName);
    })
    .catch(() => {
      if (force || !userCsvOverride) loadCsvText(defaultSampleCsv, `${defaultCsvFileName} (bundled test sample)`);
    });
}

function loadSampleCsvFromButton() {
  userCsvOverride = false;
  loadDefaultSampleCsv(true);
}

function loadCsvColumns() {
  analyzePatterns();
}

function calculateInterarrivals(values, dataType) {
  if (dataType === "interarrival-times") return values.filter((value) => value > 0);

  const interarrivals = [];
  for (let index = 1; index < values.length; index += 1) {
    const gap = values[index] - values[index - 1];
    if (gap > 0) interarrivals.push(gap);
  }
  return interarrivals;
}

function timeVaryingArrivalSchedule(arrivalValues) {
  if (arrivalValues.length < 12) return null;

  const sorted = [...arrivalValues].sort((left, right) => left - right);
  const startTime = sorted[0];
  const endTime = sorted[sorted.length - 1];
  const duration = endTime - startTime;
  if (duration <= 0) return null;

  const windowCount = 3;
  const windowLength = duration / windowCount;
  const windows = Array.from({ length: windowCount }, (_, index) => {
    const start = startTime + index * windowLength;
    const end = index === windowCount - 1 ? endTime + Number.EPSILON : start + windowLength;
    const count = sorted.filter((value) => value >= start && value < end).length;
    const rate = count / Math.max(0.1, windowLength / 60);
    return { start, end, count, rate };
  });

  const rates = windows.map((window) => window.rate).filter((rate) => rate > 0);
  const minRate = Math.min(...rates);
  const maxRate = Math.max(...rates);
  if (!Number.isFinite(minRate) || minRate <= 0) return null;

  return {
    windows,
    rateRatio: maxRate / minRate,
    scheduleText: windows
      .map((window) => `${formatNumber(window.start, 0)}-${formatNumber(window.end, 0)}:${formatNumber(window.rate, 1)}`)
      .join(","),
  };
}

function coefficientOfVariation(values) {
  const average = mean(values);
  if (average <= 0) return 0;
  return standardDeviation(values) / average;
}

function recommendArrivalPattern(interarrivals, arrivalValues, dataType) {
  const timeVaryingSchedule = dataType === "arrival-times" ? timeVaryingArrivalSchedule(arrivalValues) : null;
  if (timeVaryingSchedule && timeVaryingSchedule.rateRatio >= 1.8) {
    return "time-varying-rate";
  }

  const bestPattern = recommendBestPattern(interarrivals, ["deterministic", "exponential", "normal", "lognormal", "uniform"]);
  return bestPattern === "exponential" ? "poisson-rate" : bestPattern;
}

function recommendServicePattern(serviceTimes) {
  return recommendBestPattern(serviceTimes, ["deterministic", "exponential", "normal", "lognormal", "uniform"]);
}

function patternLabel(value) {
  if (value === "deterministic") return "Deterministic";
  if (value === "exponential") return "Exponential";
  if (value === "poisson-rate") return "Poisson rate";
  if (value === "time-varying-rate") return "Time-varying rate";
  if (value === "lognormal") return "Lognormal";
  if (value === "uniform") return "Uniform";
  return "Normal";
}

function renderHelperCard(title, recommendation, stats, note) {
  const items = stats.map(([label, value]) => `<li>${label}: ${value}</li>`).join("");
  return `
    <div class="helper-card">
      <h3>${title}</h3>
      <strong>${recommendation}</strong>
      <p>${note}</p>
      <ul>${items}</ul>
    </div>
  `;
}

function approximateErf(value) {
  const sign = value < 0 ? -1 : 1;
  const absValue = Math.abs(value);
  const t = 1 / (1 + 0.3275911 * absValue);
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-absValue * absValue);
  return sign * y;
}

function normalCdf(value, meanValue, standardDeviation) {
  if (standardDeviation <= 0) return value < meanValue ? 0 : 1;
  return 0.5 * (1 + approximateErf((value - meanValue) / (standardDeviation * Math.sqrt(2))));
}

function fittedCdf(value, stats, pattern) {
  if (pattern === "exponential") return 1 - Math.exp(-Math.max(0, value) / stats.mean);
  if (pattern === "normal") return normalCdf(value, stats.mean, stats.stddev);
  if (pattern === "lognormal") {
    if (value <= 0 || stats.logStddev <= 0) return value <= 0 ? 0 : 1;
    return normalCdf(Math.log(value), stats.logMean, stats.logStddev);
  }
  if (pattern === "uniform") {
    if (value <= stats.min) return 0;
    if (value >= stats.max) return 1;
    return (value - stats.min) / Math.max(0.1, stats.max - stats.min);
  }
  return value < stats.mean ? 0 : 1;
}

function distributionFitStats(values) {
  const sorted = [...values].sort((left, right) => left - right);
  const positiveValues = sorted.filter((value) => value > 0);
  const logValues = positiveValues.map((value) => Math.log(value));
  return {
    sorted,
    mean: mean(sorted),
    stddev: standardDeviation(sorted),
    min: Math.min(...sorted),
    max: Math.max(...sorted),
    logMean: mean(logValues),
    logStddev: standardDeviation(logValues),
  };
}

function distributionFitGap(values, pattern, context = {}) {
  if (!values.length) return Number.POSITIVE_INFINITY;
  if (pattern === "time-varying-rate" && context.arrivalValues) {
    const schedule = timeVaryingArrivalSchedule(context.arrivalValues);
    return schedule ? Math.max(0.02, 0.25 / schedule.rateRatio) : Number.POSITIVE_INFINITY;
  }

  const stats = distributionFitStats(values);
  const fittedPattern = pattern === "poisson-rate" ? "exponential" : pattern;
  return stats.sorted.reduce((maxGapValue, value, index) => {
    const empiricalCdf = (index + 1) / stats.sorted.length;
    const fittedProbability = fittedCdf(value, stats, fittedPattern);
    return Math.max(maxGapValue, Math.abs(empiricalCdf - fittedProbability));
  }, 0);
}

function recommendBestPattern(values, patterns) {
  return patterns
    .map((pattern) => ({ pattern, gap: distributionFitGap(values, pattern) }))
    .sort((left, right) => left.gap - right.gap)[0].pattern;
}

function fitQualityLabel(ksGap) {
  if (ksGap <= 0.15) return "strong";
  if (ksGap <= 0.3) return "moderate";
  return "weak";
}

function renderDistributionFitPlot(values, options) {
  if (!values.length) return "";

  const sorted = [...values].sort((left, right) => left - right);
  const sampleMean = mean(sorted);
  const sampleStddev = standardDeviation(sorted);
  const positiveValues = sorted.filter((value) => value > 0);
  const logValues = positiveValues.map((value) => Math.log(value));
  const fitStats = {
    mean: sampleMean,
    stddev: sampleStddev,
    min: Math.min(...sorted),
    max: Math.max(...sorted),
    logMean: mean(logValues),
    logStddev: standardDeviation(logValues),
  };
  const minValue = Math.min(0, ...sorted);
  const maxValue = Math.max(...sorted, sampleMean + sampleStddev * 2);
  const plotWidth = 640;
  const plotHeight = 260;
  const padding = 34;
  const innerWidth = plotWidth - padding * 2;
  const innerHeight = plotHeight - padding * 2;
  const xScale = (value) => padding + ((value - minValue) / Math.max(0.1, maxValue - minValue)) * innerWidth;
  const yScale = (value) => padding + (1 - value) * innerHeight;

  const empiricalPoints = sorted.map((value, index) => {
    const empiricalCdf = (index + 1) / sorted.length;
    return `${xScale(value)},${yScale(empiricalCdf)}`;
  }).join(" ");

  const fitNames = options.fitNames;
  const fits = fitNames.map((fitName) => {
    const fittedPattern = fitName === "poisson-rate" ? "exponential" : fitName;
    const points = fittedPattern === "time-varying-rate"
      ? ""
      : fittedPattern === "deterministic"
      ? [
        `${xScale(minValue)},${yScale(0)}`,
        `${xScale(sampleMean)},${yScale(0)}`,
        `${xScale(sampleMean)},${yScale(1)}`,
        `${xScale(maxValue)},${yScale(1)}`,
      ].join(" ")
      : Array.from({ length: 80 }, (_, index) => {
        const xValue = minValue + ((maxValue - minValue) * index) / 79;
        const yValue = fittedCdf(xValue, fitStats, fittedPattern);
        return `${xScale(xValue)},${yScale(yValue)}`;
      }).join(" ");

    const ksGap = fitName === "time-varying-rate" && options.arrivalValues
      ? distributionFitGap(sorted, fitName, { arrivalValues: options.arrivalValues })
      : sorted.reduce((maxGapValue, value, index) => {
      const empiricalCdf = (index + 1) / sorted.length;
      const fittedProbability = fittedCdf(value, fitStats, fittedPattern);
      return Math.max(maxGapValue, Math.abs(empiricalCdf - fittedProbability));
    }, 0);

    return { name: fitName, points, ksGap };
  });

  const fitMetrics = fits.map((fit) =>
    `<label class="fit-metric fit-toggle-card ${fit.name === options.recommendedPattern ? "selected" : ""}">
      <input class="fit-toggle" type="checkbox" data-fit-toggle="${options.id}-${fit.name}" ${fit.name === options.recommendedPattern ? "checked" : ""}>
      <span>${patternLabel(fit.name)}</span>
      <strong>${formatNumber(fit.ksGap, 3)}</strong>
      <em class="fit-quality fit-quality-${fitQualityLabel(fit.ksGap)}">${fitQualityLabel(fit.ksGap)} fit</em>
    </label>`
  ).join("");

  const fitLines = fits
    .filter((fit) => fit.points)
    .map((fit) =>
      `<polyline class="fit-line fit-line-${fit.name}${fit.name === options.recommendedPattern ? "" : " fit-layer-hidden"}" data-fit-layer="${options.id}-${fit.name}" points="${fit.points}"></polyline>`
    )
    .join("");
  const bestFitLabel = patternLabel(options.recommendedPattern);

  return `
    <div class="helper-card helper-chart-card">
      <h3>${options.title}</h3>
      <p>${options.description} Best fit is shown first; click fit-gap cards to toggle plotted curves.</p>
      <strong class="best-fit-badge">Best fit: ${bestFitLabel}</strong>
      <div class="fit-plot-wrap">
        <svg class="fit-plot" viewBox="0 0 ${plotWidth} ${plotHeight}" role="img" aria-label="${options.title}">
          <line class="fit-axis" x1="${padding}" y1="${plotHeight - padding}" x2="${plotWidth - padding}" y2="${plotHeight - padding}"></line>
          <line class="fit-axis" x1="${padding}" y1="${padding}" x2="${padding}" y2="${plotHeight - padding}"></line>
          <text class="fit-label" x="${padding}" y="18">Cumulative probability</text>
          <text class="fit-label" x="${plotWidth - padding - 96}" y="${plotHeight - 8}">${options.xLabel}</text>
          ${fitLines}
          <polyline class="fit-points" data-fit-layer="${options.id}-empirical" points="${empiricalPoints}"></polyline>
          ${sorted.map((value, index) => `<circle class="fit-dot" data-fit-layer="${options.id}-empirical" cx="${xScale(value)}" cy="${yScale((index + 1) / sorted.length)}" r="3.5"></circle>`).join("")}
        </svg>
      </div>
      <div class="fit-summary">
        <div class="fit-metric fit-metric-primary">
          <span>Recommended simulator fit</span>
          <strong>${patternLabel(options.recommendedPattern)}</strong>
        </div>
        <div class="fit-metric">
          <span>Sample mean</span>
          <strong>${formatNumber(sampleMean, 3)}</strong>
        </div>
        <div class="fit-metric">
          <span>Sample standard deviation</span>
          <strong>${formatNumber(sampleStddev, 3)}</strong>
        </div>
      </div>
      <div class="fit-gap-group">
        <div class="fit-group-heading">
          <h4>Distribution Fit Gaps</h4>
          <p>Lower is better. Click a card to show or hide its plotted curve. Time-varying rate is schedule-based, so it is scored but not drawn as a CDF line.</p>
        </div>
        <label class="fit-metric fit-toggle-card fit-observed-toggle selected">
          <input class="fit-toggle" type="checkbox" data-fit-toggle="${options.id}-empirical" checked>
          <span>Observed data</span>
          <strong>On</strong>
          <em class="fit-quality fit-quality-strong">empirical</em>
        </label>
        <div class="fit-gap-grid">
          ${fitMetrics}
        </div>
      </div>
    </div>
  `;
}

function renderInterarrivalFitPlot(interarrivals, dataType, recommendedPattern, arrivalValues = []) {
  const sourceText = dataType === "arrival-times"
    ? "Derived from arrival times using: current arrival time minus previous arrival time."
    : "Read directly from the selected interarrival-time column.";

  return renderDistributionFitPlot(interarrivals, {
    id: "arrival",
    title: "Arrival Distribution Fit",
    description: `${sourceText} Compare the observed empirical CDF against supported arrival fit curves.`,
    xLabel: "Interarrival time",
    fitNames: ["deterministic", "poisson-rate", "time-varying-rate", "normal", "lognormal", "uniform"],
    recommendedPattern,
    arrivalValues,
  });
}

function renderArrivalRateOverTimePlot(arrivalValues) {
  if (arrivalValues.length < 3) return "";

  const sorted = [...arrivalValues].sort((left, right) => left - right);
  const startTime = sorted[0];
  const endTime = sorted[sorted.length - 1];
  const duration = endTime - startTime;
  if (duration <= 0) return "";

  const binCount = Math.min(10, Math.max(4, Math.ceil(Math.sqrt(sorted.length))));
  const binLength = duration / binCount;
  const bins = Array.from({ length: binCount }, (_, index) => {
    const start = startTime + index * binLength;
    const end = index === binCount - 1 ? endTime + Number.EPSILON : start + binLength;
    const count = sorted.filter((value) => value >= start && value < end).length;
    const rate = count / Math.max(0.1, binLength / 60);
    return { start, end, count, rate };
  });

  const plotWidth = 640;
  const plotHeight = 240;
  const padding = 36;
  const innerWidth = plotWidth - padding * 2;
  const innerHeight = plotHeight - padding * 2;
  const maxRate = Math.max(...bins.map((bin) => bin.rate), 1);
  const fittedSchedule = timeVaryingArrivalSchedule(sorted);
  const fittedMaxRate = fittedSchedule ? Math.max(...fittedSchedule.windows.map((window) => window.rate), 1) : 1;
  const chartMaxRate = Math.max(maxRate, fittedMaxRate);
  const xScale = (value) => padding + ((value - startTime) / Math.max(0.1, duration)) * innerWidth;
  const yScale = (value) => padding + (1 - value / chartMaxRate) * innerHeight;
  const barWidth = Math.max(8, innerWidth / binCount - 8);
  const points = bins.map((bin) => `${xScale((bin.start + bin.end) / 2)},${yScale(bin.rate)}`).join(" ");
  const scheduleStepPath = fittedSchedule
    ? fittedSchedule.windows.map((window, index) => {
      const startX = xScale(window.start);
      const endX = xScale(window.end);
      const y = yScale(window.rate);
      return `${index === 0 ? `M ${startX} ${y}` : `L ${startX} ${y}`} L ${endX} ${y}`;
    }).join(" ")
    : "";

  return `
    <div class="helper-card helper-chart-card">
      <h3>Arrival Rate Over Time</h3>
      <p>This plot bins arrivals over the observed time window. Tall bars show busier periods, which helps identify rush patterns that a single distribution may hide.</p>
      <div class="fit-plot-wrap">
        <svg class="fit-plot" viewBox="0 0 ${plotWidth} ${plotHeight}" role="img" aria-label="Arrival rate over time">
          <line class="fit-axis" x1="${padding}" y1="${plotHeight - padding}" x2="${plotWidth - padding}" y2="${plotHeight - padding}"></line>
          <line class="fit-axis" x1="${padding}" y1="${padding}" x2="${padding}" y2="${plotHeight - padding}"></line>
          <text class="fit-label" x="${padding}" y="18">Arrivals per hour</text>
          <text class="fit-label" x="${plotWidth - padding - 84}" y="${plotHeight - 8}">Arrival time</text>
          ${bins.map((bin) => {
            const barHeight = plotHeight - padding - yScale(bin.rate);
            return `<rect class="arrival-rate-bar" x="${xScale(bin.start) + 4}" y="${yScale(bin.rate)}" width="${barWidth}" height="${barHeight}">
              <title>${formatNumber(bin.start, 1)}-${formatNumber(bin.end, 1)} min: ${bin.count} arrivals, ${formatNumber(bin.rate, 1)} per hour</title>
            </rect>`;
          }).join("")}
          <polyline class="arrival-rate-line" points="${points}"></polyline>
          ${scheduleStepPath ? `<path class="arrival-rate-step-line" data-fit-layer="arrival-time-varying-rate" d="${scheduleStepPath}">
            <title>Fitted time-varying rate schedule</title>
          </path>` : ""}
        </svg>
      </div>
      <div class="fit-summary">
        <div class="fit-metric">
          <span>Time window</span>
          <strong>${formatNumber(duration, 1)} min</strong>
        </div>
        <div class="fit-metric">
          <span>Peak rate</span>
          <strong>${formatNumber(chartMaxRate, 1)}/hr</strong>
        </div>
        <div class="fit-metric">
          <span>Bins</span>
          <strong>${binCount}</strong>
        </div>
      </div>
    </div>
  `;
}

function renderServiceFitPlot(serviceTimes, recommendedPattern) {
  return renderDistributionFitPlot(serviceTimes, {
    id: "service",
    title: "Service Distribution Fit",
    description: "Compare observed service times against common fit curves.",
    xLabel: "Service time",
    fitNames: ["deterministic", "exponential", "normal", "lognormal", "uniform"],
    recommendedPattern,
  });
}

function analyzePatterns() {
  if (latestCsvRows.length < 2) {
    patternHelperResults.innerHTML = renderHelperCard("CSV import", "No CSV loaded", [["Rows found", 0]], "Upload a CSV file before analyzing data.");
    return;
  }

  const arrivalIndex = Number(csvArrivalColumn.value);
  const serviceIndex = Number(csvServiceColumn.value);
  if (!Number.isInteger(arrivalIndex) || !Number.isInteger(serviceIndex)) {
    patternHelperResults.innerHTML = renderHelperCard("CSV import", "Choose columns", [["Data rows", latestCsvRows.length - 1]], "Select an arrival column and service column before analyzing data.");
    return;
  }

  const dataRows = latestCsvRows.slice(1);
  const selectedHeader = latestCsvRows[0][arrivalIndex].toLowerCase().replace(/[^a-z0-9]/g, "");
  csvArrivalDataType = selectedHeader === "interarrivaltime" || selectedHeader === "interarrival" ? "interarrival-times" : "arrival-times";
  const arrivalValues = dataRows.map((row) => Number(row[arrivalIndex])).filter((value) => Number.isFinite(value) && value >= 0);
  const serviceValues = dataRows.map((row) => Number(row[serviceIndex])).filter((value) => Number.isFinite(value) && value > 0);
  const interarrivals = calculateInterarrivals(arrivalValues, csvArrivalDataType);
  const cards = [
    renderHelperCard(
      "CSV import",
      latestCsvSource || "Loaded CSV",
      [
        ["Data rows", dataRows.length],
        ["Arrival column", latestCsvRows[0][arrivalIndex]],
        ["Service column", latestCsvRows[0][serviceIndex]],
      ],
      latestCsvSource && latestCsvSource.includes(defaultCsvFileName)
        ? "The MIT-licensed 911 calls teaching sample is preloaded for testing. Upload another CSV to replace it."
        : "Uploaded data is ready for arrival and service pattern fitting."
    ),
  ];
  const charts = [];
  const recommendation = {};

  if (interarrivals.length >= 2) {
    const arrivalMean = mean(interarrivals);
    const arrivalStddev = standardDeviation(interarrivals);
    const arrivalCv = coefficientOfVariation(interarrivals);
    const timeVaryingSchedule = csvArrivalDataType === "arrival-times" ? timeVaryingArrivalSchedule(arrivalValues) : null;
    const arrivalPattern = recommendArrivalPattern(interarrivals, arrivalValues, csvArrivalDataType);
    recommendation.arrivalDistribution = arrivalPattern;
    recommendation.interarrival = arrivalMean;
    recommendation.arrivalStddev = Math.max(0.1, arrivalStddev);
    recommendation.arrivalRate = arrivalsPerHour(arrivalMean);
    recommendation.arrivalRateSchedule = timeVaryingSchedule ? timeVaryingSchedule.scheduleText : "";
    cards.push(
      renderHelperCard(
        "Arrival recommendation",
        patternLabel(arrivalPattern),
        [
          ["Samples used", interarrivals.length],
          ["Mean interarrival", formatNumber(arrivalMean, 3)],
          ["Equivalent calls per hour", formatNumber(recommendation.arrivalRate, 1)],
          ["Rate variation", timeVaryingSchedule ? `${formatNumber(timeVaryingSchedule.rateRatio, 2)}x` : "N/A"],
          ["Std. deviation", formatNumber(arrivalStddev, 3)],
          ["Coefficient of variation", formatNumber(arrivalCv, 3)],
        ],
        arrivalPattern === "time-varying-rate"
          ? "Arrival rates change materially across the file, so a time-varying call rate is more appropriate than one overall distribution fit."
          : `${patternLabel(arrivalPattern)} had the smallest fit gap against the observed interarrival-time distribution.`
      )
    );
    if (csvArrivalDataType === "arrival-times") {
      charts.push(renderArrivalRateOverTimePlot(arrivalValues));
    }
    charts.push(renderInterarrivalFitPlot(interarrivals, csvArrivalDataType, arrivalPattern, arrivalValues));
  } else {
    cards.push(renderHelperCard("Arrival recommendation", "Need more data", [["Samples used", interarrivals.length]], "Use a CSV with at least three arrival-time rows."));
  }

  if (serviceValues.length >= 2) {
    const serviceMean = mean(serviceValues);
    const serviceStddev = standardDeviation(serviceValues);
    const serviceCv = coefficientOfVariation(serviceValues);
    const servicePattern = recommendServicePattern(serviceValues);
    recommendation.serviceDistribution = servicePattern;
    recommendation.service = serviceMean;
    recommendation.serviceStddev = Math.max(0.1, serviceStddev);
    cards.push(
      renderHelperCard(
        "Service recommendation",
        patternLabel(servicePattern),
        [
          ["Samples used", serviceValues.length],
          ["Mean service time", formatNumber(serviceMean, 3)],
          ["Std. deviation", formatNumber(serviceStddev, 3)],
          ["Coefficient of variation", formatNumber(serviceCv, 3)],
        ],
        `${patternLabel(servicePattern)} had the smallest fit gap against the observed service-time distribution.`
      )
    );
    charts.push(renderServiceFitPlot(serviceValues, servicePattern));
  } else {
    cards.push(renderHelperCard("Service recommendation", "Need more data", [["Samples used", serviceValues.length]], "Enter at least two positive service-time observations."));
  }

  latestPatternRecommendation = recommendation;
  patternHelperResults.innerHTML = [...cards, ...charts].join("");
}

function applyPatternRecommendation() {
  if (!latestPatternRecommendation) analyzePatterns();
  if (!latestPatternRecommendation) return;

  if (latestPatternRecommendation.arrivalDistribution) {
    arrivalDistribution.value = latestPatternRecommendation.arrivalDistribution;
    document.querySelector("#interarrival-time").value = formatNumber(latestPatternRecommendation.interarrival, 2);
    document.querySelector("#arrival-stddev").value = formatNumber(latestPatternRecommendation.arrivalStddev, 2);
    document.querySelector("#arrival-rate").value = formatNumber(latestPatternRecommendation.arrivalRate, 1);
    if (latestPatternRecommendation.arrivalRateSchedule) {
      document.querySelector("#arrival-rate-schedule").value = latestPatternRecommendation.arrivalRateSchedule;
    }
    updateArrivalControls();
  }

  if (latestPatternRecommendation.serviceDistribution) {
    serviceDistribution.value = latestPatternRecommendation.serviceDistribution;
    document.querySelector("#service-time").value = formatNumber(latestPatternRecommendation.service, 2);
    document.querySelector("#service-stddev").value = formatNumber(latestPatternRecommendation.serviceStddev, 2);
    updateServiceControls();
  }

  switchTab("simulator-tab");
  resetSimulation();
}

function toggleFitLayer(event) {
  if (!event.target.matches(".fit-toggle")) return;
  const layerName = event.target.dataset.fitToggle;
  event.target.closest("label").classList.toggle("selected", event.target.checked);
  patternHelperResults.querySelectorAll(`[data-fit-layer="${layerName}"]`).forEach((element) => {
    element.classList.toggle("fit-layer-hidden", !event.target.checked);
  });
}

function moveTooltip(event) {
  const wrapperBounds = flowCanvas.parentElement.getBoundingClientRect();
  const tooltipWidth = flowTooltip.offsetWidth || 260;
  const tooltipHeight = flowTooltip.offsetHeight || 80;
  const maxX = Math.max(8, flowCanvas.parentElement.clientWidth - tooltipWidth - 12);
  const maxY = Math.max(8, flowCanvas.parentElement.clientHeight - tooltipHeight - 12);
  const x = clampNumber(event.clientX - wrapperBounds.left, 8, maxX, 8);
  const y = clampNumber(event.clientY - wrapperBounds.top, 8, maxY, 8);
  flowTooltip.style.left = `${x}px`;
  flowTooltip.style.top = `${y}px`;
}

function showTooltip(event) {
  const target = event.target.closest("[data-tooltip]");
  if (!target || !flowCanvas.contains(target)) {
    hideTooltip();
    return;
  }

  flowTooltip.textContent = target.dataset.tooltip;
  flowTooltip.hidden = false;
  moveTooltip(event);
}

function hideTooltip() {
  flowTooltip.hidden = true;
}

function startDrag(event) {
  const node = event.target.closest("[data-node-id]");
  if (!node) return;
  stopSimulation();
  hideTooltip();
  event.preventDefault();
  const bounds = flowCanvas.getBoundingClientRect();
  const id = node.dataset.nodeId;
  dragState = {
    id,
    offsetX: event.clientX - bounds.left - layout[id].x,
    offsetY: event.clientY - bounds.top - layout[id].y,
  };
  flowCanvas.setPointerCapture(event.pointerId);
}

function moveDrag(event) {
  if (!dragState || !currentModel) return;
  const bounds = flowCanvas.getBoundingClientRect();
  const isStatus = dragState.id.startsWith("status");
  const maxX = flowCanvas.clientWidth - (isStatus ? 132 : 150) - 8;
  const maxY = flowCanvas.clientHeight - (isStatus ? 66 : 76) - 8;
  layout[dragState.id].x = clampNumber(event.clientX - bounds.left - dragState.offsetX, 8, maxX, layout[dragState.id].x);
  layout[dragState.id].y = clampNumber(event.clientY - bounds.top - dragState.offsetY, 8, maxY, layout[dragState.id].y);
  renderFlow(currentModel, lastSimulationTime);
}

function endDrag(event) {
  if (!dragState) return;
  dragState = null;
  flowCanvas.releasePointerCapture(event.pointerId);
}

function applyCapacityOption(event) {
  const thresholdButton = event.target.closest("[data-capacity-gos-threshold]");
  if (thresholdButton) {
    selectedCapacityGosThreshold = Number(thresholdButton.dataset.capacityGosThreshold);
    const config = getSimulationConfig();
    const capacityOptions = evaluateServerCapacity(config);
    const recommendation = recommendServerCount(capacityOptions, selectedCapacityGosThreshold);
    renderCapacityGuidance(config, capacityOptions, recommendation);
    return;
  }

  const button = event.target.closest("[data-apply-server-count]");
  if (!button) return;

  document.querySelector("#server-count").value = button.dataset.applyServerCount;
  resetSimulation();
}

arrivalDistribution.addEventListener("change", handleArrivalDistributionChange);
serviceDistribution.addEventListener("change", handleServiceDistributionChange);
document.querySelector("#queue-type").addEventListener("change", handleQueueTypeChange);
csvFile.addEventListener("change", readCsvFile);
document.querySelector("#load-sample-csv").addEventListener("click", loadSampleCsvFromButton);
document.querySelector("#analyze-patterns").addEventListener("click", analyzePatterns);
document.querySelector("#apply-patterns").addEventListener("click", applyPatternRecommendation);
patternHelperResults.addEventListener("change", toggleFitLayer);
simulationRecommendations.addEventListener("click", applyCapacityOption);
document.querySelector("#run-simulation").addEventListener("click", runSimulation);
document.querySelector("#run-full-day").addEventListener("click", runFullDaySimulation);
document.querySelector("#run-replications").addEventListener("click", runReplications);
document.querySelector("#stop-simulation").addEventListener("click", stopSimulation);
document.querySelector("#reset-simulation").addEventListener("click", resetSimulation);
document.querySelector("#reorganize-canvas").addEventListener("click", reorganizeCanvas);
flowCanvas.addEventListener("pointerdown", startDrag);
flowCanvas.addEventListener("pointermove", moveDrag);
flowCanvas.addEventListener("pointerup", endDrag);
flowCanvas.addEventListener("pointercancel", endDrag);
flowCanvas.addEventListener("pointerover", showTooltip);
flowCanvas.addEventListener("pointermove", showTooltip);
flowCanvas.addEventListener("pointerout", (event) => {
  if (!event.relatedTarget || !flowCanvas.contains(event.relatedTarget)) hideTooltip();
});

setupTabs();
updateArrivalControls();
updateServiceControls();
updateReplicationControls();
resetSimulation();
