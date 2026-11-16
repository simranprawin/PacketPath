
// ==========================================
// PACKETPATH - NETWORK PROTOCOL VISUALIZER
// ==========================================

// ---------- Navigation ----------
const pageTitles = {
  overview: "Network Learning Dashboard",
  osi: "OSI Model Explorer",
  tcp: "TCP Handshake Simulator",
  dns: "DNS Lookup Simulator",
  journey: "Packet Journey Simulator",
  compare: "TCP vs UDP Comparison",
  topology: "Network Topology Builder"
};

function navigateTo(page) {
  document.querySelectorAll(".page").forEach(section => {
    section.classList.toggle("active", section.id === page);
  });

  document.querySelectorAll(".nav-btn").forEach(button => {
    button.classList.toggle("active", button.dataset.page === page);
  });

  document.getElementById("pageTitle").textContent = pageTitles[page];
  document.getElementById("currentSection").textContent = page.toUpperCase();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll("[data-page]").forEach(button => {
  button.addEventListener("click", () => navigateTo(button.dataset.page));
});

document.querySelectorAll("[data-go]").forEach(button => {
  button.addEventListener("click", () => navigateTo(button.dataset.go));
});

// ---------- OSI Model ----------
const osiData = {
  7: {
    name: "Application Layer",
    description: "Provides network services directly to applications used by people. It acts as the interface between user applications and the network.",
    functions: [
      "Provides application-level network services.",
      "Supports communication between applications.",
      "Allows services such as web browsing and email."
    ],
    examples: ["HTTP", "DNS", "SMTP", "FTP"]
  },
  6: {
    name: "Presentation Layer",
    description: "Makes sure data is represented in a format that the receiving system can understand.",
    functions: [
      "Data translation and formatting.",
      "Encryption and decryption.",
      "Data compression and decompression."
    ],
    examples: ["TLS/SSL", "JPEG", "PNG", "ASCII"]
  },
  5: {
    name: "Session Layer",
    description: "Establishes, manages, and terminates communication sessions between applications.",
    functions: [
      "Creates communication sessions.",
      "Maintains and manages sessions.",
      "Coordinates dialogue between systems."
    ],
    examples: ["RPC", "NetBIOS", "Session management"]
  },
  4: {
    name: "Transport Layer",
    description: "Provides end-to-end data delivery between devices and manages segmentation, flow control, and error recovery.",
    functions: [
      "Segments application data.",
      "Uses port numbers to identify applications.",
      "Supports reliable or connectionless transport."
    ],
    examples: ["TCP", "UDP", "Port numbers"]
  },
  3: {
    name: "Network Layer",
    description: "Handles logical addressing and routing so packets can travel between different networks.",
    functions: [
      "Provides logical IP addressing.",
      "Determines paths through networks.",
      "Forwards packets toward destinations."
    ],
    examples: ["IPv4", "IPv6", "ICMP", "Routers"]
  },
  2: {
    name: "Data Link Layer",
    description: "Transfers frames between devices on the same local network and uses physical addressing.",
    functions: [
      "Creates and processes frames.",
      "Uses MAC addresses.",
      "Detects certain transmission errors."
    ],
    examples: ["Ethernet", "Wi-Fi MAC", "Switches"]
  },
  1: {
    name: "Physical Layer",
    description: "Transmits raw bits through physical media using electrical, optical, or radio signals.",
    functions: [
      "Transmits raw binary bits.",
      "Defines physical connectors and signals.",
      "Specifies cables and transmission media."
    ],
    examples: ["Fiber optic", "Ethernet cables", "Radio signals"]
  }
};

let selectedLayer = 7;

function displayLayer(number) {
  selectedLayer = number;
  const layer = osiData[number];

  document.querySelectorAll(".osi-layer").forEach(button => {
    button.classList.toggle(
      "active",
      Number(button.dataset.layer) === number
    );
  });

  document.getElementById("layerNumber").textContent = `LAYER ${number}`;
  document.getElementById("layerName").textContent = layer.name;
  document.getElementById("layerDescription").textContent = layer.description;

  const functionList = document.getElementById("layerFunctions");
  functionList.innerHTML = "";

  layer.functions.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    functionList.appendChild(li);
  });

  const examples = document.getElementById("layerExamples");
  examples.innerHTML = "";

  layer.examples.forEach(item => {
    const span = document.createElement("span");
    span.textContent = item;
    examples.appendChild(span);
  });

  document.getElementById("prevLayer").disabled = number === 1;
  document.getElementById("nextLayer").disabled = number === 7;
}

document.querySelectorAll(".osi-layer").forEach(button => {
  button.addEventListener("click", () => {
    displayLayer(Number(button.dataset.layer));
  });
});

document.getElementById("prevLayer").addEventListener("click", () => {
  if (selectedLayer > 1) displayLayer(selectedLayer - 1);
});

document.getElementById("nextLayer").addEventListener("click", () => {
  if (selectedLayer < 7) displayLayer(selectedLayer + 1);
});

displayLayer(7);

// ---------- TCP 3-Way Handshake ----------
const handshakeSteps = [
  {
    id: "step1",
    message: "Step 1: Client sends SYN to request a connection.",
    flag: "SYN"
  },
  {
    id: "step2",
    message: "Step 2: Server responds with SYN-ACK.",
    flag: "SYN-ACK"
  },
  {
    id: "step3",
    message: "Step 3: Client sends ACK. Connection established!",
    flag: "ACK"
  }
];

let handshakeRunning = false;
let handshakeToken = 0;

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function resetHandshakeUI() {
  handshakeToken++;

  handshakeRunning = false;

  handshakeSteps.forEach(step => {
    document.getElementById(step.id).classList.remove("active", "done");
  });

  const status = document.getElementById("connectionStatus");
  status.textContent = "NOT CONNECTED";
  status.classList.remove("connected");

  document.getElementById("handshakeLog").innerHTML =
    '<span class="log-dot"></span> Waiting to start the simulation...';

  document.getElementById("startHandshake").disabled = false;
  document.getElementById("startHandshake").textContent = "▶ Start Handshake";
}

async function runHandshake() {
  if (handshakeRunning) return;

  resetHandshakeUI();

  handshakeRunning = true;
  const currentToken = handshakeToken;

  const startButton = document.getElementById("startHandshake");
  const log = document.getElementById("handshakeLog");

  startButton.disabled = true;
  startButton.textContent = "Simulation running...";

  for (let i = 0; i < handshakeSteps.length; i++) {
    if (currentToken !== handshakeToken) return;

    const step = handshakeSteps[i];
    const element = document.getElementById(step.id);

    element.classList.add("active");

    log.innerHTML = `<span class="log-dot"></span>${step.message}`;

    await wait(1500);

    if (currentToken !== handshakeToken) return;

    element.classList.remove("active");
    element.classList.add("done");
  }

  if (currentToken !== handshakeToken) return;

  const status = document.getElementById("connectionStatus");
  status.textContent = "CONNECTED";
  status.classList.add("connected");

  log.innerHTML =
    '<span class="log-dot"></span> SUCCESS: TCP connection established. Data transfer can begin.';

  startButton.disabled = false;
  startButton.textContent = "↻ Run Again";

  handshakeRunning = false;
}

document.getElementById("startHandshake").addEventListener("click", runHandshake);
document.getElementById("resetHandshake").addEventListener("click", resetHandshakeUI);

// ---------- DNS Simulation ----------
const domainRecords = {
  "example.com": "93.184.216.34",
  "google.com": "142.250.183.14",
  "github.com": "140.82.112.4",
  "openai.com": "104.18.33.45",
  "wikipedia.org": "208.80.154.224",
  "cloudflare.com": "104.16.132.229",
  "microsoft.com": "13.107.246.40"
};

let dnsToken = 0;

function resetDNSNodes() {
  document.querySelectorAll(".dns-node").forEach(node => {
    node.classList.remove("active", "done");
  });
}

async function resolveDNS() {
  const domainInput = document.getElementById("domainInput");
  const domain = domainInput.value.trim().toLowerCase();
  const result = document.getElementById("dnsResult");

  dnsToken++;
  const currentToken = dnsToken;

  resetDNSNodes();

  if (!domain) {
    result.innerHTML = `
      <span class="result-icon">⚠️</span>
      <div><strong>Domain required</strong><p>Please enter a domain name.</p></div>
    `;
    return;
  }

  const validDomain =
    /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i;

  if (!validDomain.test(domain)) {
    result.innerHTML = `
      <span class="result-icon">⚠️</span>
      <div><strong>Invalid domain format</strong><p>Enter a domain such as example.com.</p></div>
    `;
    return;
  }

  const nodes = [
    document.querySelector('[data-dns="browser"]'),
    document.querySelector('[data-dns="resolver"]'),
    document.querySelector('[data-dns="server"]')
  ];

  result.innerHTML = `
    <span class="result-icon">🔄</span>
    <div><strong>Looking up ${domain}</strong><p>Simulating the DNS resolution process...</p></div>
  `;

  for (let i = 0; i < nodes.length; i++) {
    if (currentToken !== dnsToken) return;

    nodes[i].classList.add("active");
    await wait(850);

    if (currentToken !== dnsToken) return;

    nodes[i].classList.remove("active");
    nodes[i].classList.add("done");
  }

  const ip = domainRecords[domain];

  if (ip) {
    result.innerHTML = `
      <span class="result-icon">✅</span>
      <div>
        <strong>Simulated DNS resolution successful</strong>
        <p>Domain: <b>${domain}</b><br>Example IP address: <b>${ip}</b><br>The predefined record was found in this educational simulation.</p>
      </div>
    `;
  } else {
    result.innerHTML = `
      <span class="result-icon">ℹ️</span>
      <div>
        <strong>No sample record available</strong>
        <p>${domain} is not included in this simulator's sample records. This does not mean the domain is invalid or unavailable on the real internet.</p>
      </div>
    `;
  }
}

document.getElementById("resolveDomain").addEventListener("click", resolveDNS);

document.getElementById("domainInput").addEventListener("keydown", event => {
  if (event.key === "Enter") resolveDNS();
});

// ---------- Packet Journey ----------
let packetSending = false;
let packetTimer;

async function sendPacket() {
  if (packetSending) return;

  const message = document.getElementById("packetMessage").value.trim();
  const status = document.getElementById("packetStatus");
  const packet1 = document.getElementById("movingPacket");
  const packet2 = document.getElementById("movingPacket2");
  const button = document.getElementById("sendPacket");

  if (!message) {
    status.textContent = "Please enter a message before sending.";
    return;
  }

  packetSending = true;
  button.disabled = true;
  button.textContent = "Sending...";

  packet1.classList.remove("animate");
  packet2.classList.remove("animate");

  void packet1.offsetWidth;

  status.textContent = `Preparing packet: "${message}"`;

  await wait(300);

  status.textContent = "Packet traveling from sender to router...";
  packet1.classList.add("animate");

  await wait(1400);

  status.textContent = "Router has received the packet and is forwarding it...";
  packet2.classList.add("animate");

  await wait(1400);

  status.textContent = `✓ Packet successfully delivered! Message: "${message}"`;

  packetSending = false;
  button.disabled = false;
  button.textContent = "➜ Send Another Packet";
}

document.getElementById("sendPacket").addEventListener("click", sendPacket);

// ---------- Network Topology Builder ----------
const topologyCanvas = document.getElementById("topologyCanvas");
const topologyLines = document.getElementById("topologyLines");
const emptyTopology = document.getElementById("emptyTopology");
const builderHint = document.getElementById("builderHint");

let devices = [];
let connections = [];
let selectedDevices = [];
let deviceCounter = 0;
let connectMode = false;

const deviceTypes = {
  Computer: { icon: "💻", label: "Computer" },
  Router: { icon: "📡", label: "Router" },
  Server: { icon: "🖥️", label: "Server" }
};

function addDevice(type) {
  deviceCounter++;

  const positions = [
    [20, 28], [50, 28], [80, 28],
    [20, 72], [50, 72], [80, 72],
    [35, 50], [65, 50]
  ];

  const position = positions[(deviceCounter - 1) % positions.length];

  devices.push({
    id: deviceCounter,
    type,
    x: position[0],
    y: position[1]
  });

  renderTopology();
  builderHint.textContent = `${type} added. Select two devices to connect them.`;
}

function renderTopology() {
  document.querySelectorAll(".topology-device").forEach(el => el.remove());

  emptyTopology.style.display = devices.length ? "none" : "flex";

  devices.forEach(device => {
    const element = document.createElement("button");
    element.className = "topology-device";
    element.style.left = device.x + "%";
    element.style.top = device.y + "%";

    if (selectedDevices.includes(device.id)) {
      element.classList.add("selected");
    }

    const info = deviceTypes[device.type];

    const icon = document.createElement("span");
    icon.textContent = info.icon;

    const label = document.createElement("strong");
    label.textContent = `${info.label} ${device.id}`;

    element.append(icon, label);

    element.addEventListener("click", () => selectDevice(device.id));

    topologyCanvas.appendChild(element);
  });

  renderConnections();

  document.getElementById("deviceCount").textContent =
    `${devices.length} device${devices.length === 1 ? "" : "s"}`;

  document.getElementById("connectionCount").textContent =
    `${connections.length} connection${connections.length === 1 ? "" : "s"}`;
}

function renderConnections() {
  const width = topologyCanvas.clientWidth;
  const height = topologyCanvas.clientHeight;

  topologyLines.setAttribute("viewBox", `0 0 ${width} ${height}`);
  topologyLines.innerHTML = "";

  connections.forEach(connection => {
    const first = devices.find(d => d.id === connection[0]);
    const second = devices.find(d => d.id === connection[1]);

    if (!first || !second) return;

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");

    line.setAttribute("x1", width * first.x / 100);
    line.setAttribute("y1", height * first.y / 100);
    line.setAttribute("x2", width * second.x / 100);
    line.setAttribute("y2", height * second.y / 100);
    line.setAttribute("class", "topology-edge");

    topologyLines.appendChild(line);
  });
}

function selectDevice(id) {
  if (!connectMode) {
    builderHint.textContent = "Click Connect two nodes, then select two devices.";
    return;
  }

  if (selectedDevices.includes(id)) {
    selectedDevices = selectedDevices.filter(item => item !== id);
  } else if (selectedDevices.length < 2) {
    selectedDevices.push(id);
  }

  renderTopology();

  if (selectedDevices.length === 2) {
    const [a, b] = selectedDevices;

    const alreadyConnected = connections.some(connection =>
      (connection[0] === a && connection[1] === b) ||
      (connection[0] === b && connection[1] === a)
    );

    if (a === b || alreadyConnected) {
      builderHint.textContent = "These devices are already connected.";
    } else {
      connections.push([a, b]);
      builderHint.textContent = "Connection created successfully!";
    }

    selectedDevices = [];
    connectMode = false;
    document.getElementById("connectNodes").textContent = "↔ Connect two nodes";
    renderTopology();
  } else {
    builderHint.textContent = "Select one more device to create a connection.";
  }
}

document.querySelectorAll("[data-add]").forEach(button => {
  button.addEventListener("click", () => {
    addDevice(button.dataset.add);
  });
});

document.getElementById("connectNodes").addEventListener("click", () => {
  if (devices.length < 2) {
    builderHint.textContent = "Add at least two devices before connecting them.";
    return;
  }

  connectMode = !connectMode;
  selectedDevices = [];

  document.getElementById("connectNodes").textContent =
    connectMode ? "✕ Cancel connection" : "↔ Connect two nodes";

  builderHint.textContent = connectMode
    ? "Select the first device, then select the second device."
    : "Connection mode cancelled.";

  renderTopology();
});

document.getElementById("clearTopology").addEventListener("click", () => {
  devices = [];
  connections = [];
  selectedDevices = [];
  connectMode = false;

  document.getElementById("connectNodes").textContent = "↔ Connect two nodes";

  builderHint.textContent = "Network cleared. Add new devices to start again.";

  renderTopology();
});

window.addEventListener("resize", () => {
  renderConnections();
});

// Initial setup
renderTopology();
resetHandshakeUI();

console.log("PacketPath Network Lab initialized successfully.");
