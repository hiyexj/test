const dashboardData = {
  metrics: [
    { label: "通过率", value: "87%", trend: "+6% 较昨日" },
    { label: "阻塞项", value: "03", trend: "2 项处理中" },
    { label: "活跃用例", value: "24", trend: "覆盖 6 个模块" },
    { label: "最近更新", value: "18:40", trend: "今日已同步" }
  ],
  updates: [
    { time: "18:40", title: "支付主链路回归完成", detail: "已完成下单、支付回执与退款通知校验。" },
    { time: "16:15", title: "消息中心冒烟通过", detail: "未读态同步恢复正常，需补日志埋点验证。" },
    { time: "14:20", title: "后台筛选联动修复上线", detail: "多条件组合查询已可稳定返回结果。" }
  ],
  testCases: [
    {
      title: "登录态跨端同步",
      module: "账号系统",
      priority: "P0",
      status: "通过",
      owner: "陈宁",
      description: "验证 Web 与 H5 登录状态续期、退出清理与重复登录处理。",
      tags: ["鉴权", "跨端", "主流程"]
    },
    {
      title: "支付结果回执",
      module: "支付中心",
      priority: "P0",
      status: "进行中",
      owner: "赵岚",
      description: "校验回执落库、状态刷新、异常重试与退款回写场景。",
      tags: ["支付", "回执", "对账"]
    },
    {
      title: "推送消息红点同步",
      module: "消息中心",
      priority: "P1",
      status: "通过",
      owner: "林放",
      description: "验证站内信、系统通知和活动推送在多个入口的已读态同步。",
      tags: ["推送", "红点", "已读态"]
    },
    {
      title: "筛选器多条件组合",
      module: "运营后台",
      priority: "P1",
      status: "阻塞",
      owner: "周越",
      description: "组合筛选涉及日期、状态和角色时，部分条件下返回空结果。",
      tags: ["后台", "筛选", "列表"]
    },
    {
      title: "弱网重试提示",
      module: "公共框架",
      priority: "P2",
      status: "进行中",
      owner: "许言",
      description: "验证弱网下请求重试提示、按钮禁用态与错误文案是否一致。",
      tags: ["弱网", "交互", "提示"]
    },
    {
      title: "数据回刷延迟校验",
      module: "数据同步",
      priority: "P1",
      status: "阻塞",
      owner: "何清",
      description: "检查订单状态回刷到报表中心的延迟和重复更新问题。",
      tags: ["同步", "报表", "延迟"]
    }
  ],
  releaseNote: {
    version: "Release 2.6.0-rc",
    updatedAt: "2026-06-16 18:40",
    summary: "本轮已覆盖支付、消息、后台配置三条主路径，建议继续完成阻塞项修复后进入全量回归。"
  },
  contacts: [
    { label: "测试负责人", value: "qa-hub@example.com", href: "mailto:qa-hub@example.com", note: "工作日 10:00 - 19:00" },
    { label: "研发值班", value: "dev-bridge@example.com", href: "mailto:dev-bridge@example.com", note: "主流程阻塞优先同步" },
    { label: "联调群组", value: "测试站联调群 / #release-qa", href: "", note: "用于同步修复进度与回归结论" }
  ]
};

const page = document.body.dataset.page;

function renderHome() {
  const heroMetrics = document.querySelector("#heroMetrics");
  const metricsGrid = document.querySelector("#metricsGrid");
  const timeline = document.querySelector("#updateTimeline");

  heroMetrics.innerHTML = dashboardData.metrics
    .slice(0, 2)
    .map(
      (item) => `
        <article class="mini-metric">
          <span>${item.label}</span>
          <strong>${item.value}</strong>
          <small>${item.trend}</small>
        </article>
      `
    )
    .join("");

  metricsGrid.innerHTML = dashboardData.metrics
    .map(
      (item) => `
        <article class="metric-card">
          <p>${item.label}</p>
          <strong>${item.value}</strong>
          <span>${item.trend}</span>
        </article>
      `
    )
    .join("");

  timeline.innerHTML = dashboardData.updates
    .map(
      (item) => `
        <div class="timeline-item">
          <span>${item.time}</span>
          <div>
            <strong>${item.title}</strong>
            <p>${item.detail}</p>
          </div>
        </div>
      `
    )
    .join("");
}

function createFilterButtons(target, items, type, activeValue, onClick) {
  target.innerHTML = items
    .map(
      (item) => `
        <button class="pill-button ${activeValue === item ? "is-active" : ""}" type="button" data-type="${type}" data-value="${item}">
          ${item}
        </button>
      `
    )
    .join("");

  target.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => onClick(button.dataset.value));
  });
}

function renderCases() {
  const summary = document.querySelector("#caseSummary");
  const caseGrid = document.querySelector("#caseGrid");
  const statusFilters = document.querySelector("#statusFilters");
  const priorityFilters = document.querySelector("#priorityFilters");

  const state = {
    status: "全部",
    priority: "全部"
  };

  const summaryItems = [
    { label: "全部用例", value: String(dashboardData.testCases.length) },
    { label: "P0 数量", value: String(dashboardData.testCases.filter((item) => item.priority === "P0").length) },
    { label: "阻塞项", value: String(dashboardData.testCases.filter((item) => item.status === "阻塞").length) }
  ];

  summary.innerHTML = summaryItems
    .map(
      (item) => `
        <article class="mini-metric">
          <span>${item.label}</span>
          <strong>${item.value}</strong>
        </article>
      `
    )
    .join("");

  function drawCases() {
    const visibleCases = dashboardData.testCases.filter((item) => {
      const statusMatched = state.status === "全部" || item.status === state.status;
      const priorityMatched = state.priority === "全部" || item.priority === state.priority;
      return statusMatched && priorityMatched;
    });

    caseGrid.innerHTML = visibleCases
      .map(
        (item) => `
          <article class="case-card">
            <div class="case-topline">
              <span class="chip ${statusClassName(item.status)}">${item.status}</span>
              <span class="chip chip-outline">${item.priority}</span>
            </div>
            <h3>${item.title}</h3>
            <p>${item.description}</p>
            <div class="case-meta">
              <span>${item.module}</span>
              <span>负责人：${item.owner}</span>
            </div>
            <div class="tag-row">
              ${item.tags.map((tag) => `<span>${tag}</span>`).join("")}
            </div>
          </article>
        `
      )
      .join("");
  }

  createFilterButtons(statusFilters, ["全部", "通过", "进行中", "阻塞"], "status", state.status, (value) => {
    state.status = value;
    createFilterButtons(statusFilters, ["全部", "通过", "进行中", "阻塞"], "status", state.status, (next) => {
      state.status = next;
      drawCases();
      renderCaseFilters();
    });
    drawCases();
    renderCaseFilters();
  });

  createFilterButtons(priorityFilters, ["全部", "P0", "P1", "P2"], "priority", state.priority, (value) => {
    state.priority = value;
    createFilterButtons(priorityFilters, ["全部", "P0", "P1", "P2"], "priority", state.priority, (next) => {
      state.priority = next;
      drawCases();
      renderCaseFilters();
    });
    drawCases();
    renderCaseFilters();
  });

  function renderCaseFilters() {
    createFilterButtons(statusFilters, ["全部", "通过", "进行中", "阻塞"], "status", state.status, (value) => {
      state.status = value;
      drawCases();
      renderCaseFilters();
    });

    createFilterButtons(priorityFilters, ["全部", "P0", "P1", "P2"], "priority", state.priority, (value) => {
      state.priority = value;
      drawCases();
      renderCaseFilters();
    });
  }

  drawCases();
}

function renderFeedback() {
  const releaseNote = document.querySelector("#releaseNote");
  const contactList = document.querySelector("#contactList");

  releaseNote.innerHTML = `
    <p class="panel-label">当前版本</p>
    <h2>${dashboardData.releaseNote.version}</h2>
    <p>${dashboardData.releaseNote.summary}</p>
    <span class="release-time">更新时间：${dashboardData.releaseNote.updatedAt}</span>
  `;

  contactList.innerHTML = dashboardData.contacts
    .map(
      (item) => `
        <div class="contact-item">
          <strong>${item.label}</strong>
          ${item.href ? `<a href="${item.href}">${item.value}</a>` : `<span class="contact-value">${item.value}</span>`}
          <span>${item.note}</span>
        </div>
      `
    )
    .join("");
}

function statusClassName(status) {
  if (status === "通过") return "chip-success";
  if (status === "进行中") return "chip-warning";
  return "chip-danger";
}

if (page === "home") {
  renderHome();
}

if (page === "cases") {
  renderCases();
}

if (page === "feedback") {
  renderFeedback();
}
