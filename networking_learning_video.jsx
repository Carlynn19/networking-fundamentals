import { useState, useEffect, useCallback, useRef } from "react";

const SLIDE_DURATION = 12000;

const colors = {
  bg: "#0a0e1a",
  bgCard: "#111827",
  bgAccent: "#1a2235",
  primary: "#38bdf8",
  primaryDim: "#1e6b99",
  secondary: "#f59e0b",
  tertiary: "#a78bfa",
  success: "#34d399",
  danger: "#f87171",
  text: "#e2e8f0",
  textDim: "#94a3b8",
  textMuted: "#64748b",
  border: "#1e293b",
  white: "#ffffff",
};

const slides = [
  {
    id: "title",
    section: "intro",
    title: "Networking Fundamentals",
    subtitle: "WAN vs LAN • IPv4 vs IPv6 • Subnetting • SIP & VoIP",
    content: null,
    visual: "globe",
  },
  {
    id: "lan-intro",
    section: "WAN vs LAN",
    title: "What Is a LAN?",
    subtitle: "Local Area Network",
    content: [
      "Connects devices within a limited area — office, building, or home",
      "Owned and fully managed by the organisation",
      "Speeds of 1–10 Gbps on wired, 1 Gbps+ on Wi-Fi 6",
      "Ultra-low latency: under 1 ms on Ethernet",
    ],
    visual: "lan",
  },
  {
    id: "wan-intro",
    section: "WAN vs LAN",
    title: "What Is a WAN?",
    subtitle: "Wide Area Network",
    content: [
      "Spans cities, countries, or the entire globe",
      "Connects multiple LANs together across distance",
      "Infrastructure leased from ISPs / carriers",
      "Higher latency (10–200+ ms) and higher cost per Mbps",
    ],
    visual: "wan",
  },
  {
    id: "lan-wan-compare",
    section: "WAN vs LAN",
    title: "LAN vs WAN Comparison",
    subtitle: null,
    content: null,
    visual: "compare-lan-wan",
  },
  {
    id: "lan-troubleshoot",
    section: "WAN vs LAN",
    title: "Troubleshooting LAN",
    subtitle: "Common Issues & Fixes",
    content: [
      "No connectivity → Check cable, port LEDs, DHCP assignment",
      "Slow speeds → Duplex mismatch, CRC errors, bad cables",
      "Wi-Fi drops → Channel congestion, AP overload, firmware",
      "Broadcast storms → Enable STP, find rogue switches/hubs",
    ],
    visual: "troubleshoot",
  },
  {
    id: "wan-troubleshoot",
    section: "WAN vs LAN",
    title: "Troubleshooting WAN",
    subtitle: "Common Issues & Fixes",
    content: [
      "Outage → Ping ISP gateway, check router WAN interface",
      "High latency → traceroute to find the bad hop, report to ISP",
      "VPN down → Check Phase 1/2 logs, NAT-T settings, certs",
      "Packet loss → iperf3 between sites, compare to SLA",
    ],
    visual: "troubleshoot",
  },
  {
    id: "ipv4-intro",
    section: "IPv4 vs IPv6",
    title: "IPv4 Explained",
    subtitle: "32-bit Addressing",
    content: [
      "Format: 4 octets in dotted decimal — 192.168.1.10",
      "~4.3 billion addresses total (many reserved)",
      "Private ranges: 10.x.x.x, 172.16–31.x.x, 192.168.x.x",
      "NAT allows many devices to share one public IP",
    ],
    visual: "ipv4",
  },
  {
    id: "ipv6-intro",
    section: "IPv6 vs IPv4",
    title: "IPv6 Explained",
    subtitle: "128-bit Addressing",
    content: [
      "Format: 8 hex groups — 2001:db8:85a3::8a2e:0370:7334",
      "3.4 × 10³⁸ addresses — effectively unlimited",
      "SLAAC: devices auto-configure without DHCP",
      "No NAT needed, no broadcast — uses multicast instead",
    ],
    visual: "ipv6",
  },
  {
    id: "ip-compare",
    section: "IPv4 vs IPv6",
    title: "IPv4 vs IPv6",
    subtitle: null,
    content: null,
    visual: "compare-ip",
  },
  {
    id: "ip-troubleshoot",
    section: "IPv4 vs IPv6",
    title: "Troubleshooting IP",
    subtitle: "Common Issues & Fixes",
    content: [
      "169.254.x.x (APIPA) → DHCP server unreachable, check VLAN",
      "IP conflict → arp -a to find duplicate MAC, use reservations",
      "IPv6 not working → Verify router advertisements (RAs)",
      "Dual-stack timeout → Test ping -6, check AAAA DNS records",
    ],
    visual: "troubleshoot",
  },
  {
    id: "subnet-intro",
    section: "Subnetting",
    title: "Why Subnet?",
    subtitle: "Divide & Conquer Your Network",
    content: [
      "Control broadcasts — each subnet = its own broadcast domain",
      "Security — firewall rules between segments (servers, guests, etc.)",
      "Efficient IP usage — allocate only what each segment needs",
      "Routing optimisation — smaller tables, faster convergence",
    ],
    visual: "subnet",
  },
  {
    id: "subnet-masks",
    section: "Subnetting",
    title: "Common Subnet Masks",
    subtitle: null,
    content: null,
    visual: "subnet-table",
  },
  {
    id: "subnet-steps",
    section: "Subnetting",
    title: "How to Subnet",
    subtitle: "Step-by-Step: 192.168.10.0/24 → 4 Subnets",
    content: [
      "① Need 4 subnets → borrow 2 bits (2² = 4)",
      "② New mask: /24 + 2 = /26 (255.255.255.192)",
      "③ Block size: 256 – 192 = 64 addresses each",
      "④ Subnets: .0/26, .64/26, .128/26, .192/26",
    ],
    visual: "subnet-calc",
  },
  {
    id: "subnet-troubleshoot",
    section: "Subnetting",
    title: "Troubleshooting Subnets",
    subtitle: "Common Issues & Fixes",
    content: [
      "Can't reach gateway → Wrong subnet mask, verify with ipconfig",
      "VLANs can't talk → Check inter-VLAN routing / SVI config",
      "Wrong DHCP scope → Verify relay agent + matching scope",
      "Overlapping subnets → Use ipcalc to verify ranges",
    ],
    visual: "troubleshoot",
  },
  {
    id: "voip-intro",
    section: "SIP & VoIP",
    title: "How VoIP Works",
    subtitle: "Voice Over IP Networks",
    content: [
      "Voice → digitised → compressed (codec) → IP packets → network",
      "Real-time: sensitive to latency, jitter, and packet loss",
      "SIP handles signalling (setup/teardown of calls)",
      "RTP carries the actual audio stream over UDP",
    ],
    visual: "voip",
  },
  {
    id: "sip-flow",
    section: "SIP & VoIP",
    title: "SIP Registration & Calls",
    subtitle: "How Phones Connect",
    content: [
      "REGISTER → Server challenges (401) → Re-auth → 200 OK",
      "Call: INVITE → 180 Ringing → 200 OK → ACK → RTP flows",
      "Either side sends BYE to end the call",
      "Registration expires and must be renewed periodically",
    ],
    visual: "sip-flow",
  },
  {
    id: "voip-quality",
    section: "SIP & VoIP",
    title: "VoIP Quality Thresholds",
    subtitle: null,
    content: null,
    visual: "voip-quality",
  },
  {
    id: "voip-troubleshoot",
    section: "SIP & VoIP",
    title: "Troubleshooting VoIP",
    subtitle: "Common Issues & Fixes",
    content: [
      "401 loop → Wrong credentials or clock skew on phone",
      "One-way audio → NAT issue, SDP has private IP, use STUN",
      "No audio → Firewall blocking RTP ports (10000–20000)",
      "Poor quality → Enable QoS (DSCP EF), disable SIP ALG",
    ],
    visual: "troubleshoot",
  },
  {
    id: "end",
    section: "Summary",
    title: "Key Takeaways",
    subtitle: null,
    content: [
      "LAN = local, fast, self-managed  |  WAN = distant, leased, higher latency",
      "IPv4 = 32-bit, NAT-dependent  |  IPv6 = 128-bit, auto-config, no NAT",
      "Subnetting = broadcast control + security + efficient IP allocation",
      "VoIP/SIP = real-time, NAT-sensitive — always check ALG & firewall first",
    ],
    visual: "summary",
  },
];

const sectionColors = {
  intro: colors.primary,
  "WAN vs LAN": colors.secondary,
  "IPv4 vs IPv6": colors.tertiary,
  "IPv6 vs IPv4": colors.tertiary,
  Subnetting: colors.success,
  "SIP & VoIP": colors.danger,
  Summary: colors.primary,
};

// ─── Visual Components ───

function GlobeVisual({ progress }) {
  const r = 80;
  const cx = 150, cy = 120;
  const rot = progress * 360;
  return (
    <svg viewBox="0 0 300 240" style={{ width: "100%", maxWidth: 400 }}>
      <defs>
        <radialGradient id="glow" cx="40%" cy="35%">
          <stop offset="0%" stopColor={colors.primary} stopOpacity="0.3" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r + 20} fill="url(#glow)" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={colors.primary} strokeWidth="1.5" opacity="0.6" />
      <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.35} fill="none" stroke={colors.primary} strokeWidth="1" opacity="0.4" transform={`rotate(${rot * 0.1} ${cx} ${cy})`} />
      <ellipse cx={cx} cy={cy} rx={r * 0.35} ry={r} fill="none" stroke={colors.primary} strokeWidth="1" opacity="0.4" />
      <ellipse cx={cx} cy={cy} rx={r * 0.7} ry={r} fill="none" stroke={colors.primary} strokeWidth="1" opacity="0.3" />
      {[0, 60, 120, 180, 240, 300].map((a, i) => {
        const x = cx + Math.cos(((a + rot) * Math.PI) / 180) * r;
        const y = cy + Math.sin(((a + rot) * Math.PI) / 180) * r * 0.35;
        return <circle key={i} cx={x} cy={y} r="3" fill={colors.secondary} opacity="0.8">
          <animate attributeName="r" values="2;4;2" dur="2s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
        </circle>;
      })}
    </svg>
  );
}

function LANVisual() {
  const devices = [
    { x: 150, y: 40, label: "Switch" },
    { x: 60, y: 130, label: "PC" },
    { x: 150, y: 150, label: "Laptop" },
    { x: 240, y: 130, label: "Printer" },
  ];
  return (
    <svg viewBox="0 0 300 200" style={{ width: "100%", maxWidth: 360 }}>
      {devices.slice(1).map((d, i) => (
        <line key={i} x1={150} y1={55} x2={d.x} y2={d.y - 15} stroke={colors.primary} strokeWidth="2" opacity="0.5">
          <animate attributeName="strokeDasharray" values="0,200;200,0" dur="1.5s" begin={`${i * 0.3}s`} fill="freeze" />
        </line>
      ))}
      {devices.map((d, i) => (
        <g key={i}>
          <rect x={d.x - 28} y={d.y - 14} width="56" height="28" rx="6" fill={i === 0 ? colors.primaryDim : colors.bgAccent} stroke={i === 0 ? colors.primary : colors.textMuted} strokeWidth="1.5">
            <animate attributeName="opacity" values="0;1" dur="0.5s" begin={`${i * 0.2}s`} fill="freeze" />
          </rect>
          <text x={d.x} y={d.y + 4} textAnchor="middle" fill={colors.text} fontSize="11" fontFamily="monospace">{d.label}</text>
        </g>
      ))}
      <text x="150" y="190" textAnchor="middle" fill={colors.textDim} fontSize="10">Single location • High speed • Low latency</text>
    </svg>
  );
}

function WANVisual() {
  const nodes = [
    { x: 50, y: 70, label: "Office A" },
    { x: 250, y: 70, label: "Office B" },
    { x: 150, y: 160, label: "HQ" },
  ];
  return (
    <svg viewBox="0 0 300 200" style={{ width: "100%", maxWidth: 360 }}>
      <defs>
        <marker id="arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6" fill={colors.secondary} opacity="0.6" />
        </marker>
      </defs>
      {[[0,1],[1,2],[0,2]].map(([a,b], i) => (
        <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} stroke={colors.secondary} strokeWidth="2" strokeDasharray="6,4" opacity="0.4" markerEnd="url(#arr)">
          <animate attributeName="strokeDashoffset" values="20;0" dur="2s" repeatCount="indefinite" />
        </line>
      ))}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r="24" fill={colors.bgAccent} stroke={colors.secondary} strokeWidth="1.5">
            <animate attributeName="r" values="22;26;22" dur="3s" begin={`${i * 0.5}s`} repeatCount="indefinite" />
          </circle>
          <text x={n.x} y={n.y + 4} textAnchor="middle" fill={colors.text} fontSize="10" fontFamily="monospace">{n.label}</text>
        </g>
      ))}
      <text x="150" y="17" textAnchor="middle" fill={colors.textDim} fontSize="10">Multiple locations • ISP links • Higher latency</text>
    </svg>
  );
}

function CompareTable({ rows, headers }) {
  return (
    <div style={{ width: "100%", maxWidth: 500, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: `1fr ${headers.slice(1).map(() => "1fr").join(" ")}`, gap: 2, fontSize: 13 }}>
        {headers.map((h, i) => (
          <div key={i} style={{ background: colors.primaryDim, padding: "8px 12px", fontWeight: 700, color: colors.white, borderRadius: i === 0 ? "8px 0 0 0" : i === headers.length - 1 ? "0 8px 0 0" : 0, textAlign: "center" }}>{h}</div>
        ))}
        {rows.map((row, ri) =>
          row.map((cell, ci) => (
            <div key={`${ri}-${ci}`} style={{ background: ri % 2 === 0 ? colors.bgAccent : colors.bgCard, padding: "7px 12px", color: colors.textDim, textAlign: "center", borderRadius: ri === rows.length - 1 ? (ci === 0 ? "0 0 0 8px" : ci === row.length - 1 ? "0 0 8px 0" : 0) : 0 }}>{cell}</div>
          ))
        )}
      </div>
    </div>
  );
}

function SubnetVisual() {
  const blocks = [
    { label: ".0/26", range: ".1–.62", color: colors.primary },
    { label: ".64/26", range: ".65–.126", color: colors.secondary },
    { label: ".128/26", range: ".129–.190", color: colors.tertiary },
    { label: ".192/26", range: ".193–.254", color: colors.success },
  ];
  return (
    <div style={{ display: "flex", gap: 4, width: "100%", maxWidth: 480, margin: "0 auto" }}>
      {blocks.map((b, i) => (
        <div key={i} style={{ flex: 1, background: `${b.color}18`, border: `2px solid ${b.color}60`, borderRadius: 8, padding: "14px 8px", textAlign: "center", animation: `fadeSlideUp 0.5s ${i * 0.15}s both` }}>
          <div style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 14, color: b.color }}>{b.label}</div>
          <div style={{ fontSize: 11, color: colors.textDim, marginTop: 4 }}>{b.range}</div>
          <div style={{ fontSize: 10, color: colors.textMuted, marginTop: 2 }}>62 hosts</div>
        </div>
      ))}
    </div>
  );
}

function VoIPVisual() {
  return (
    <svg viewBox="0 0 340 150" style={{ width: "100%", maxWidth: 400 }}>
      {/* Phone A */}
      <rect x="10" y="50" width="70" height="50" rx="8" fill={colors.bgAccent} stroke={colors.danger} strokeWidth="1.5" />
      <text x="45" y="80" textAnchor="middle" fill={colors.text} fontSize="10" fontFamily="monospace">Phone A</text>
      {/* PBX */}
      <rect x="135" y="35" width="70" height="80" rx="8" fill={colors.bgAccent} stroke={colors.secondary} strokeWidth="1.5" />
      <text x="170" y="72" textAnchor="middle" fill={colors.secondary} fontSize="11" fontWeight="bold">PBX</text>
      <text x="170" y="86" textAnchor="middle" fill={colors.textDim} fontSize="9">SIP Server</text>
      {/* Phone B */}
      <rect x="260" y="50" width="70" height="50" rx="8" fill={colors.bgAccent} stroke={colors.success} strokeWidth="1.5" />
      <text x="295" y="80" textAnchor="middle" fill={colors.text} fontSize="10" fontFamily="monospace">Phone B</text>
      {/* SIP arrows */}
      <line x1="80" y1="65" x2="135" y2="65" stroke={colors.danger} strokeWidth="1.5" strokeDasharray="4,3">
        <animate attributeName="strokeDashoffset" values="14;0" dur="1s" repeatCount="indefinite" />
      </line>
      <line x1="205" y1="65" x2="260" y2="65" stroke={colors.success} strokeWidth="1.5" strokeDasharray="4,3">
        <animate attributeName="strokeDashoffset" values="14;0" dur="1s" repeatCount="indefinite" />
      </line>
      <text x="108" y="58" textAnchor="middle" fill={colors.textDim} fontSize="9">SIP</text>
      <text x="233" y="58" textAnchor="middle" fill={colors.textDim} fontSize="9">SIP</text>
      {/* RTP */}
      <path d="M80,90 Q170,140 260,90" fill="none" stroke={colors.tertiary} strokeWidth="1.5" strokeDasharray="6,3">
        <animate attributeName="strokeDashoffset" values="18;0" dur="1.5s" repeatCount="indefinite" />
      </path>
      <text x="170" y="135" textAnchor="middle" fill={colors.tertiary} fontSize="10" fontWeight="bold">RTP Audio Stream</text>
    </svg>
  );
}

function SIPFlowVisual() {
  const steps = ["REGISTER", "401 Challenge", "Re-Auth", "200 OK"];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
      {steps.map((s, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ background: `${colors.danger}20`, border: `1px solid ${colors.danger}50`, borderRadius: 8, padding: "8px 14px", fontSize: 12, color: colors.text, fontFamily: "monospace", animation: `fadeSlideUp 0.4s ${i * 0.2}s both` }}>{s}</div>
          {i < steps.length - 1 && <span style={{ color: colors.textMuted, fontSize: 16 }}>→</span>}
        </div>
      ))}
    </div>
  );
}

function TroubleshootIcon() {
  return (
    <svg viewBox="0 0 60 60" style={{ width: 48, margin: "0 auto 8px", display: "block" }}>
      <circle cx="30" cy="30" r="28" fill="none" stroke={colors.secondary} strokeWidth="2" opacity="0.3" />
      <text x="30" y="38" textAnchor="middle" fontSize="28">🔧</text>
    </svg>
  );
}

// ─── Slide Renderer ───

function SlideContent({ slide, progress }) {
  const sc = sectionColors[slide.section] || colors.primary;

  const renderVisual = () => {
    switch (slide.visual) {
      case "globe": return <GlobeVisual progress={progress} />;
      case "lan": return <LANVisual />;
      case "wan": return <WANVisual />;
      case "compare-lan-wan":
        return <CompareTable headers={["", "LAN", "WAN"]} rows={[
          ["Speed", "1–10 Gbps", "50 Mbps–10 Gbps"],
          ["Latency", "< 1 ms", "10–200+ ms"],
          ["Ownership", "Self-managed", "ISP / carrier"],
          ["Cost", "Low (hardware)", "High (recurring)"],
          ["Security", "Physical + network", "Encryption (VPN)"],
        ]} />;
      case "ipv4":
        return (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "monospace", fontSize: 28, color: colors.tertiary, letterSpacing: 2, marginBottom: 8 }}>192.168.1.10</div>
            <div style={{ fontSize: 12, color: colors.textDim }}>32 bits • 4 octets • ~4.3 billion addresses</div>
            <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 16 }}>
              {["11000000", "10101000", "00000001", "00001010"].map((b, i) => (
                <div key={i} style={{ fontFamily: "monospace", fontSize: 11, background: colors.bgAccent, padding: "6px 8px", borderRadius: 6, color: colors.tertiary, border: `1px solid ${colors.tertiary}30` }}>{b}</div>
              ))}
            </div>
          </div>
        );
      case "ipv6":
        return (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "monospace", fontSize: 18, color: colors.tertiary, letterSpacing: 1, marginBottom: 8, wordBreak: "break-all" }}>2001:0db8:85a3::8a2e:0370:7334</div>
            <div style={{ fontSize: 12, color: colors.textDim }}>128 bits • 8 hex groups • 3.4 × 10³⁸ addresses</div>
            <div style={{ marginTop: 16, display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
              {["SLAAC", "No NAT", "No Broadcast", "Built-in IPsec"].map((f, i) => (
                <span key={i} style={{ background: `${colors.tertiary}18`, border: `1px solid ${colors.tertiary}40`, borderRadius: 20, padding: "5px 14px", fontSize: 11, color: colors.tertiary }}>{f}</span>
              ))}
            </div>
          </div>
        );
      case "compare-ip":
        return <CompareTable headers={["", "IPv4", "IPv6"]} rows={[
          ["Bits", "32", "128"],
          ["Notation", "Dotted decimal", "Hex colon"],
          ["NAT", "Required", "Not needed"],
          ["Auto-config", "DHCP", "SLAAC"],
          ["Broadcast", "Yes", "No (multicast)"],
        ]} />;
      case "subnet": return <SubnetVisual />;
      case "subnet-table":
        return <CompareTable headers={["CIDR", "Mask", "Usable", "Use Case"]} rows={[
          ["/24", "255.255.255.0", "254", "Standard LAN"],
          ["/25", "255.255.255.128", "126", "Medium segment"],
          ["/26", "255.255.255.192", "62", "Small office"],
          ["/27", "255.255.255.224", "30", "Server VLAN"],
          ["/28", "255.255.255.240", "14", "Small segment"],
          ["/30", "255.255.255.252", "2", "Point-to-point"],
        ]} />;
      case "subnet-calc": return <SubnetVisual />;
      case "voip": return <VoIPVisual />;
      case "sip-flow": return <SIPFlowVisual />;
      case "voip-quality":
        return <CompareTable headers={["Metric", "Target", "If Exceeded"]} rows={[
          ["Latency", "< 150 ms", "Delay in conversation"],
          ["Jitter", "< 30 ms", "Choppy / distorted"],
          ["Packet Loss", "< 1%", "Gaps, robotic audio"],
          ["Bandwidth", "~85 kbps", "All metrics degrade"],
        ]} />;
      case "troubleshoot": return <TroubleshootIcon />;
      case "summary":
        return (
          <div style={{ textAlign: "center", marginTop: 8 }}>
            <span style={{ fontSize: 40 }}>🎓</span>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 420, padding: "24px 20px", textAlign: "center", animation: "fadeSlideUp 0.6s ease both" }}>
      {slide.id !== "title" && (
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 3, color: sc, marginBottom: 12, opacity: 0.8 }}>{slide.section}</div>
      )}
      <h1 style={{ fontSize: slide.id === "title" ? 36 : 26, fontWeight: 800, color: colors.white, margin: "0 0 6px", lineHeight: 1.2, fontFamily: "'Instrument Sans', 'DM Sans', system-ui, sans-serif" }}>{slide.title}</h1>
      {slide.subtitle && <p style={{ fontSize: 14, color: colors.textDim, margin: "0 0 20px", maxWidth: 480 }}>{slide.subtitle}</p>}
      <div style={{ margin: "16px 0 20px", width: "100%" }}>{renderVisual()}</div>
      {slide.content && (
        <div style={{ textAlign: "left", maxWidth: 520, width: "100%" }}>
          {slide.content.map((line, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, animation: `fadeSlideUp 0.4s ${0.15 + i * 0.1}s both` }}>
              <span style={{ color: sc, fontWeight: 700, fontSize: 16, lineHeight: "22px", flexShrink: 0 }}>›</span>
              <span style={{ fontSize: 13, color: colors.text, lineHeight: "22px" }}>{line}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main App ───

export default function NetworkingVideo() {
  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);
  const startRef = useRef(null);

  const totalSlides = slides.length;

  const goTo = useCallback((idx) => {
    setCurrent(Math.max(0, Math.min(idx, totalSlides - 1)));
    setProgress(0);
    startRef.current = Date.now();
  }, [totalSlides]);

  const next = useCallback(() => {
    if (current < totalSlides - 1) goTo(current + 1);
    else { setPlaying(false); setProgress(1); }
  }, [current, totalSlides, goTo]);

  const prev = useCallback(() => { if (current > 0) goTo(current - 1); }, [current, goTo]);

  useEffect(() => {
    if (!playing) { clearInterval(timerRef.current); return; }
    startRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const p = Math.min(elapsed / SLIDE_DURATION, 1);
      setProgress(p);
      if (p >= 1) next();
    }, 50);
    return () => clearInterval(timerRef.current);
  }, [playing, current, next]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === " ") { e.preventDefault(); setPlaying(p => !p); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev]);

  const slide = slides[current];
  const sc = sectionColors[slide.section] || colors.primary;

  return (
    <div style={{ background: colors.bg, minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "'Instrument Sans', 'DM Sans', system-ui, sans-serif", overflow: "hidden", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&display=swap');
        @keyframes fadeSlideUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button { cursor: pointer; border: none; background: none; outline: none; }
      `}</style>

      {/* Top progress bar */}
      <div style={{ height: 3, background: colors.border, position: "relative", flexShrink: 0 }}>
        <div style={{ height: "100%", background: `linear-gradient(90deg, ${sc}, ${colors.primary})`, width: `${((current + progress) / totalSlides) * 100}%`, transition: "width 0.1s linear" }} />
      </div>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 20px", flexShrink: 0 }}>
        <div style={{ fontSize: 11, color: colors.textMuted, letterSpacing: 1, textTransform: "uppercase" }}>Networking Fundamentals</div>
        <div style={{ fontSize: 12, color: colors.textDim, fontFamily: "monospace" }}>{current + 1} / {totalSlides}</div>
      </div>

      {/* Slide mini-progress dots */}
      <div style={{ display: "flex", gap: 3, justifyContent: "center", padding: "0 20px 8px", flexShrink: 0 }}>
        {slides.map((s, i) => (
          <button key={i} onClick={() => goTo(i)} style={{ width: i === current ? 24 : 8, height: 4, borderRadius: 2, background: i === current ? sc : i < current ? `${sc}60` : colors.border, transition: "all 0.3s" }} />
        ))}
      </div>

      {/* Main slide area */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", overflow: "auto" }} key={current}>
        <SlideContent slide={slide} progress={progress} />
      </div>

      {/* Controls */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 16, padding: "16px 20px 24px", flexShrink: 0 }}>
        <button onClick={prev} disabled={current === 0} style={{ width: 40, height: 40, borderRadius: "50%", background: colors.bgAccent, color: current === 0 ? colors.textMuted : colors.text, fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${colors.border}`, opacity: current === 0 ? 0.4 : 1 }}>‹</button>
        <button onClick={() => { setPlaying(p => !p); if (!playing) startRef.current = Date.now() - progress * SLIDE_DURATION; }} style={{ width: 52, height: 52, borderRadius: "50%", background: `linear-gradient(135deg, ${sc}, ${sc}cc)`, color: colors.white, fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 20px ${sc}40` }}>
          {playing ? "⏸" : "▶"}
        </button>
        <button onClick={next} disabled={current === totalSlides - 1} style={{ width: 40, height: 40, borderRadius: "50%", background: colors.bgAccent, color: current === totalSlides - 1 ? colors.textMuted : colors.text, fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${colors.border}`, opacity: current === totalSlides - 1 ? 0.4 : 1 }}>›</button>
      </div>

      {/* Keyboard hint */}
      <div style={{ textAlign: "center", paddingBottom: 12, fontSize: 10, color: colors.textMuted }}>
        ← → to navigate • Space to play/pause
      </div>
    </div>
  );
}
