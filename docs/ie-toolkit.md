<link rel="stylesheet" href="../ie-toolkit-app/embedded.css">

<div class="ie-toolkit-page" data-ie-toolkit-root="../ie-toolkit-app/">
<nav class="tab-list" aria-label="Primary sections">
  <button class="tab-button active" type="button" data-tab-target="simulator-tab" aria-selected="true">Simulator</button>
  <button class="tab-button" type="button" data-tab-target="helper-tab" aria-selected="false">Input Helper</button>
  <button class="tab-button" type="button" data-tab-target="dataset-tab" aria-selected="false">Dataset Guide</button>
  <button class="tab-button" type="button" data-tab-target="guide-tab" aria-selected="false">Simulation Guide</button>
</nav>

<main class="main-content">
  <section id="dataset-tab" class="tab-panel guide-panel" hidden>
    <article class="panel">
      <div class="section-heading">
        <p class="eyebrow">Dataset guide</p>
        <h2>MIT-licensed 911 calls sample</h2>
      </div>

      <div class="guide-content">
        <p class="guide-lede">
          The file <strong>test_911_calls_mit_sample.csv</strong> is a simulator-ready teaching sample based on the structure of
          the MIT-licensed Vera 911 calls-for-service project from Two Sigma Data Clinic and the Vera Institute of Justice.
          It keeps the simulator-required fields simple: one row per call, an arrival time, and a service-time proxy.
        </p>

        <div class="dataset-summary">
          <div class="guide-section">
            <h3>What it represents</h3>
            <p>
              Each row is one call entering a response queue. Arrival times are minutes from the start of the sampled window,
              and service times use response/handling time as the processing-time proxy for the simulation.
            </p>
          </div>
          <div class="guide-section">
            <h3>How to use it</h3>
            <p>
              Open Input Helper, click <strong>Load Sample Data</strong>, then review the automatic
              <strong>arrival_time</strong> and <strong>service_time</strong> analysis. The helper derives interarrival times
              from arrival times.
            </p>
          </div>
          <div class="guide-section">
            <h3>Important limitation</h3>
            <p>
              This is not the full Vera dataset. It is a compact local sample shaped for this simulator so users can test the
              CSV workflow without downloading a large external file.
            </p>
          </div>
        </div>

        <div class="info-grid">
          <div>
            <h3>entity_id</h3>
            <p>A unique call number for the sample.</p>
          </div>
          <div>
            <h3>arrival_time</h3>
            <p>Elapsed minutes from the start of the sampled call-center window.</p>
          </div>
          <div>
            <h3>service_time</h3>
            <p>Call handling time in minutes, used as the simulator service-time input.</p>
          </div>
          <div>
            <h3>call_type</h3>
            <p>Call source/type label. The sample uses 911 calls because the Vera project focuses on calls for service.</p>
          </div>
          <div>
            <h3>source_city</h3>
            <p>The city label from the multi-city 911 calls-for-service project.</p>
          </div>
          <div>
            <h3>source_dataset</h3>
            <p>A label identifying the MIT-licensed Vera project used for this sample structure.</p>
          </div>
        </div>

        <div class="guide-callout">
          <h3>Where this data comes from</h3>
          <p>
            The source project describes a consolidated 911 response dataset for New Orleans, Seattle, Dallas, Detroit, and Charleston.
            The project README links to downloadable CSV files for the combined dataset and each city.
          </p>
          <div class="link-button-row">
            <a class="link-button" href="https://github.com/tsdataclinic/Vera" target="_blank" rel="noreferrer">Open Dataset</a>
          </div>
        </div>

        <div class="guide-callout">
          <h3>Attribution and use</h3>
          <p>
            The Vera repository is published under the MIT License. Keep the original project attribution if you reuse this sample
            or replace it with the full source data.
          </p>
          <div class="link-button-row">
            <a class="link-button secondary-link-button" href="https://github.com/tsdataclinic/Vera/blob/master/LICENSE" target="_blank" rel="noreferrer">View MIT License</a>
          </div>
        </div>
      </div>
    </article>
  </section>

  <section id="guide-tab" class="tab-panel guide-panel" hidden>
    <article class="panel">
      <div class="section-heading">
        <p class="eyebrow">Simulation guide</p>
        <h2>What a discrete-event simulation is</h2>
      </div>

      <div class="guide-content">
        <p class="guide-lede">
          Discrete-event simulation models a system as timed events: arrivals, service starts, departures, and balks.
          It helps you test operational changes before changing the real process.
        </p>

        <div class="guide-summary">
          <div class="guide-section">
            <h3>Why it matters</h3>
            <p>
              Averages hide queues, peaks, and overload. Simulation shows how the system behaves over time,
              especially when demand arrives unevenly or service times vary. It helps reveal bottlenecks before
              they become real customer delays.
            </p>
          </div>
          <div class="guide-section">
            <h3>Value</h3>
            <p>
              Compare staffing, capacity, cost, wait time, utilization, lost demand, and service levels safely.
              You can test "what if" scenarios without disrupting production, customers, or employees.
            </p>
          </div>
          <div class="guide-section">
            <h3>What you need</h3>
            <p>
              Define the process, entities, arrivals, service times, resources, queue rule, capacity, and targets.
              Start with estimates if needed, then improve the model as better data becomes available.
            </p>
          </div>
        </div>

        <div class="info-grid">
          <div>
            <h3>Entities</h3>
            <p>The jobs, calls, parts, customers, or tickets moving through the system.</p>
          </div>
          <div>
            <h3>Arrivals</h3>
            <p>How often new entities enter the system. Shorter interarrival times create more workload pressure.</p>
          </div>
          <div>
            <h3>Servers</h3>
            <p>The people, machines, workstations, or resources that process entities.</p>
          </div>
          <div>
            <h3>Service time</h3>
            <p>How long processing takes once an entity reaches a server.</p>
          </div>
          <div>
            <h3>Queue rule</h3>
            <p>The dispatching rule used when a server becomes available, such as FIFO, LIFO, SPT, LPT, or random.</p>
          </div>
          <div>
            <h3>Grade of service</h3>
            <p>The percent of completed entities handled within target wait times, such as 10, 20, or 30 minutes.</p>
          </div>
          <div>
            <h3>Replications</h3>
            <p>
              Repeated full-day runs with different random seeds. Use one replication to inspect one seeded scenario,
              or many replications to estimate confidence intervals and percentile outcomes. Replication controls appear
              when the model uses stochastic arrivals, stochastic service, or random queue selection.
            </p>
          </div>
        </div>

        <div class="guide-callout">
          <h3>Practical first model</h3>
          <p>Start simple: one server, FIFO queue, deterministic arrivals, and deterministic service. Then change one setting at a time.</p>
        </div>

        <div class="guide-callout">
          <h3>Using the live simulator</h3>
          <p>
            Configure arrivals, service behavior, server capacity, and queue rules, then watch the flow and review the event log.
            Drag boxes on the canvas grid to arrange the view.
          </p>
        </div>

        <div class="guide-callout">
          <h3>Recommendations and replications</h3>
          <p>
            Standard capacity guidance is based on the current random seed and scenario inputs. Running replications also shows a
            stochastic recommendation: the smallest server count where at least 90% of replications meet the 80% GOS target.
          </p>
        </div>
      </div>
    </article>
  </section>

  <section id="helper-tab" class="tab-panel helper-panel" hidden>
    <article class="panel helper-setup-panel">
      <div class="section-heading">
        <p class="eyebrow">Input helper</p>
        <h2>Estimate arrival and service patterns</h2>
      </div>

      <p class="guide-lede">
        Upload a CSV or load the MIT-licensed 911 calls teaching sample to estimate arrival pattern,
        interarrival time, service pattern, mean service time, and service-time variation.
      </p>

      <div class="csv-import">
        <label>
          CSV file
          <input id="csv-file" type="file" accept=".csv,text/csv" title="Load a CSV with arrival and service-time columns." />
          <span class="field-hint">Choose a file, or use the sample data button.</span>
        </label>

        <label>
          Arrival column
          <select id="csv-arrival-column" title="Column containing arrival times or interarrival times.">
            <option value="">Load CSV first</option>
          </select>
          <span class="field-hint">Use `arrival_time`; the app derives interarrival time.</span>
        </label>

        <label>
          Service column
          <select id="csv-service-column" title="Column containing observed service times.">
            <option value="">Load CSV first</option>
          </select>
          <span class="field-hint">Observed processing times.</span>
        </label>

        <button id="load-sample-csv" class="secondary-button" type="button" title="Load the included MIT-licensed 911 calls sample for testing.">Load Sample Data</button>
        <button id="analyze-patterns" class="secondary-button" type="button" title="Analyze the selected CSV columns.">Analyze CSV</button>
        <button id="apply-patterns" class="secondary-button" type="button" title="Apply the latest recommendations to the simulator inputs.">Apply to Simulator</button>
      </div>

      <details class="sample-csv">
        <summary>Sample CSV format</summary>
        <div class="sample-csv-body">
          <div>
            <h3>Expected columns</h3>
            <p>Use a header row. `entity_id` is optional; the app detects `arrival_time` and `service_time`, then derives interarrival time.</p>
          </div>
          <pre><code>entity_id,arrival_time,service_time
1,0.0,2.1
2,1.4,1.8
3,3.1,2.4
4,4.5,2.0
5,6.0,2.2</code></pre>
        </div>
      </details>
    </article>

    <section class="helper-workspace">

      <article class="panel helper-results-panel">
        <div class="section-heading">
          <p class="eyebrow">Analysis</p>
          <h2>Fit results</h2>
        </div>
        <div id="pattern-helper-results" class="helper-results">
          <div class="helper-card helper-empty-state">
            <h3>No CSV analyzed yet</h3>
            <p>Load sample data or upload a CSV. The app detects `arrival_time` and `service_time`, then derives interarrival time.</p>
          </div>
        </div>
      </article>
    </section>
  </section>

  <section id="simulator-tab" class="tab-panel app-shell">
  <aside class="panel controls-panel" aria-label="Simulation controls">
    <div class="section-heading">
      <p class="eyebrow">Scenario</p>
      <h2>Inputs</h2>
    </div>

    <div class="control-grid">
      <label>
        Max entities
        <input id="entity-count" type="number" min="1" max="2000" value="500" title="Maximum number of jobs, calls, parts, customers, or other entities to generate during the 8 AM-5 PM simulated day." />
        <span class="field-hint">Upper limit for the full workday.</span>
      </label>

      <label>
        Servers
        <input id="server-count" type="number" min="1" max="50" value="1" title="Number of parallel servers or resources available to process entities." />
        <span class="field-hint">Parallel processing capacity.</span>
      </label>

      <label>
        Queue capacity
        <input id="queue-capacity" type="number" min="0" max="50" value="20" title="Maximum number of entities allowed to wait. Arrivals are balked when the queue is full and all servers are busy." />
        <span class="field-hint">Waiting spots before balking.</span>
      </label>

      <label>
        Queue type
        <select id="queue-type" title="Select how waiting entities are chosen when a server becomes available.">
          <option value="fifo">FIFO - first in, first out</option>
          <option value="lifo">LIFO - last in, first out</option>
          <option value="spt">SPT - shortest processing time</option>
          <option value="lpt">LPT - longest processing time</option>
          <option value="random">Random selection</option>
        </select>
        <span class="field-hint">Dispatch rule for waiting work.</span>
      </label>

      <label>
        Arrival pattern
        <select id="arrival-distribution" title="Choose the distribution used to generate time between arrivals.">
          <option value="deterministic">Deterministic</option>
          <option value="exponential">Exponential</option>
          <option value="normal">Normal</option>
          <option value="lognormal">Lognormal</option>
          <option value="uniform">Uniform</option>
          <option value="poisson-rate">Poisson rate</option>
          <option value="time-varying-rate">Time-varying rate</option>
        </select>
        <span class="field-hint">Distribution for demand entering the system.</span>
      </label>

      <label id="interarrival-time-field">
        Mean interarrival
        <input id="interarrival-time" type="number" min="0.1" step="0.1" value="1.4" title="Average time between new entity arrivals. Smaller values create more queue pressure." />
        <span id="interarrival-time-hint" class="field-hint">Average time between arrivals.</span>
      </label>

      <label id="arrival-stddev-field" hidden>
        Arrival standard deviation
        <input id="arrival-stddev" type="number" min="0.1" step="0.1" value="0.4" title="Standard deviation for normal, lognormal, and uniform interarrival times." />
        <span class="field-hint">Used for normal, lognormal, and uniform arrivals.</span>
      </label>

      <label id="arrival-rate-field" hidden>
        Arrival rate
        <input id="arrival-rate" type="number" min="0.1" step="0.1" value="30" title="Average arrivals per hour for the Poisson arrival-rate pattern." />
        <span class="field-hint">Calls per hour.</span>
      </label>

      <label id="arrival-rate-schedule-field" hidden>
        Arrival rate schedule
        <input id="arrival-rate-schedule" type="text" value="0-180:18,180-300:54,300-420:30,420-540:15" title="Time-varying rate schedule across the 8 AM to 5 PM day. Format: start-end:rate per hour, for example 0-180:18,180-300:54." />
        <span class="field-hint">Minutes after 8 AM. Example: 180-300 is 11 AM-1 PM.</span>
      </label>

      <label>
        Service pattern
        <select id="service-distribution" title="Choose the distribution used to generate service times.">
          <option value="deterministic">Deterministic</option>
          <option value="exponential">Exponential</option>
          <option value="normal">Normal</option>
          <option value="lognormal">Lognormal</option>
          <option value="uniform">Uniform</option>
        </select>
        <span class="field-hint">Distribution for processing time.</span>
      </label>

      <label id="service-time-field">
        Mean service time
        <input id="service-time" type="number" min="0.1" step="0.1" value="2" title="Average time required for a server to process one entity." />
        <span id="service-time-hint" class="field-hint">Average processing time.</span>
      </label>

      <label id="service-stddev-field" hidden>
        Service standard deviation
        <input id="service-stddev" type="number" min="0.1" step="0.1" value="0.4" title="Standard deviation for normal, lognormal, and uniform service times." />
        <span class="field-hint">Used for normal, lognormal, and uniform service.</span>
      </label>

      <label>
        Random seed
        <input id="sim-seed" type="number" min="1" step="1" value="42" title="Seed for repeatable random arrivals and service times." />
        <span class="field-hint">Repeatable random runs.</span>
      </label>
    </div>
  </aside>

  <section class="workspace">
    <article class="panel canvas-panel">
      <div class="section-heading row-heading">
        <div>
          <p class="eyebrow">Live view</p>
          <h2>Simulation canvas</h2>
        </div>
        <p class="canvas-note">Simulates an 8 AM-5 PM day. Hover for details. Drag boxes to move them.</p>
      </div>

      <div class="simulation-actions" aria-label="Simulation actions">
        <button id="run-simulation" type="button" title="Build the current scenario and start the animation from the beginning.">Run</button>
        <button id="run-full-day" type="button" title="Build the current scenario and jump directly to the 5 PM end-of-day view.">Run Full Day</button>
        <button id="run-replications" class="secondary-button" type="button" data-replication-control hidden title="Run the current scenario one or more times with sequential random seeds and summarize stochastic variation.">Run Replications</button>
        <button id="stop-simulation" class="secondary-button" type="button" title="Pause the current simulation animation at its current position.">Stop</button>
        <button id="reset-simulation" class="secondary-button" type="button" title="Stop the animation and redraw the current scenario at simulation time zero.">Reset</button>
        <button id="reorganize-canvas" class="secondary-button" type="button" title="Reorganize the simulation diagram based on the current server count.">Reorganize Canvas</button>
        <label class="replication-control" data-replication-control hidden>
          Replications
          <input id="replication-count" type="number" min="1" max="500" step="1" value="1" title="Number of independent full-day simulation runs. Use 1 for one seeded run, or increase it to estimate stochastic uncertainty." />
        </label>
        <label class="speed-control">
          Animation speed
          <input id="sim-speed" type="range" min="0.5" max="5" step="0.5" value="2" title="Controls how fast the simulation animation plays. This does not change the simulated results." />
        </label>
      </div>

      <div class="canvas-wrap">
        <div id="flow-canvas" class="flow-canvas" aria-label="Discrete-event simulation flow diagram"></div>
        <div id="flow-tooltip" class="flow-tooltip" role="status" hidden></div>
      </div>
    </article>

    <article class="panel">
      <div class="section-heading">
        <p class="eyebrow">Recommendations</p>
        <h2>Capacity guidance</h2>
      </div>
      <div id="simulation-recommendations" class="recommendation-grid"></div>
    </article>

    <article class="panel">
      <div class="section-heading">
        <p class="eyebrow">Results</p>
        <h2>Metrics</h2>
      </div>
      <div id="simulation-results" class="metric-grid"></div>
      <div id="replication-results" class="replication-results" hidden></div>
    </article>

    <article class="panel">
      <div class="section-heading">
        <p class="eyebrow">Trace</p>
        <h2>Event log</h2>
      </div>
      <div class="event-log-wrap">
        <table class="event-log">
          <thead>
            <tr>
              <th>Entity</th>
              <th>Arrival time</th>
              <th>Server</th>
              <th>Service start</th>
              <th>Departure</th>
              <th>Wait</th>
              <th>Grade of Service</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody id="simulation-log"></tbody>
        </table>
      </div>
    </article>
  </section>
  </section>
</main>


  <footer class="site-footer">
    <p>All simulation calculations run locally in the browser.</p>
  </footer>
</div>

<script>
  window.IETOOLKIT_ASSET_BASE = "../ie-toolkit-app/";
</script>
<script src="../ie-toolkit-app/app.js"></script>
