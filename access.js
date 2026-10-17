/* 表达宇宙·达达口才训练 V9: all access paths share this controller. No provider key in source. */
const runtimeApiBase = String(window.EXPR_RUNTIME_CONFIG?.apiBaseUrl || '').replace(/\/+$/, '');
const runtimeApiUrl = (path) => runtimeApiBase ? `${runtimeApiBase}${path}` : path;
class AccessController {
  constructor() {
    this.dialog = document.getElementById('access-dialog');
    this.loginDialog = document.getElementById('login-dialog');
    this.adminDialog = document.getElementById('admin-account-dialog');
    this.adminStatsDialog = document.getElementById('admin-stats-dialog');
    this.authToken = localStorage.getItem('expr_v7_auth_token') || '';
    this.user = null;
    this.key = localStorage.getItem('expr_v3_key') || sessionStorage.getItem('expr_v3_key') || '';
    this.token = localStorage.getItem('expr_v3_token') || '';
    this.mode = localStorage.getItem('expr_v3_mode') || 'byok';
    this.sessionId = sessionStorage.getItem('expr_v3_session') || '';
    this.balance = 0;
    this.remainingUses = 0;
    this.pendingPacks = 0;
    this.queue = Promise.resolve();
    this.aiQueue = Promise.resolve();
    this.config = {};
    this.serverAiAvailable = false;
    this.loginMode = 'login';
    this.configPromise = null;
    this.authorizedRecording = false;
    this.busy = false;
    this.demoMode = window.EXPR_DEMO === true;
    this.demoAccount = null;
    this.demoSession = localStorage.getItem('expr_demo_session') === '1';
  }
  async init() {
    const recoveryId = this.sessionId;
    const $ = id => document.getElementById(id);
    $('login-form').onsubmit = event => { event.preventDefault(); return this.login(); };
    $('login-register').onclick = () => this.toggleLoginMode();
    $('btn-account-login').onclick = () => { this.close(); this.openLogin(); };
    $('btn-account-logout').onclick = () => this.logout();
    if ($('admin-account-form')) $('admin-account-form').onsubmit = event => { event.preventDefault(); return this.createAccountFromAdmin(); };
    if ($('admin-account-close')) $('admin-account-close').onclick = () => this.adminDialog?.close();
    if ($('btn-admin-accounts')) $('btn-admin-accounts').onclick = () => this.openAdminAccounts();
    if ($('btn-admin-dashboard')) $('btn-admin-dashboard').onclick = () => this.openAdminStats();
    if ($('admin-stats-close')) $('admin-stats-close').onclick = () => this.adminStatsDialog?.close();
    if ($('admin-stats-refresh')) $('admin-stats-refresh').onclick = () => this.refreshAdminStats();
    this.loginDialog.addEventListener('cancel', event => event.preventDefault());
    // Bind this before the demo branch below. Static trial mode must keep the
    // same close button behavior as the server-backed page.
    $('access-close').onclick = () => this.close();
    $('btn-access-manage').onclick = () => this.open('settings');
    $('ai-connection-check')?.addEventListener('click', () => this.checkServerAIStatus());
    this.dialog.addEventListener('cancel', event => { if (this.busy) event.preventDefault(); });
    if (this.demoMode) {
      // GitHub Pages trial: require a local account while keeping the practice
      // loop offline. The account never leaves this browser.
      this.config = { betaMode: true, managedBillingEnabled: false, serverAiAvailable: false, managedAvailable: false };
      this.mode = 'demo';
      this.demoAccount = this.readDemoAccount();
      this.user = this.demoSession && this.demoAccount ? this.demoAccount : null;
      this.authToken = this.user ? 'demo-local' : '';
      this.applyConfig();
      this.renderAccountStatus();
      this.updateStatus();
      if (!this.user) this.openLogin();
      return;
    }
    if (this.authToken) {
      try { this.user = await this.api('/api/auth/me'); }
      catch (_) { this.authToken = ''; localStorage.removeItem('expr_v7_auth_token'); }
    }
    $('access-key').value = this.key;
    $('remember-key').checked = !!localStorage.getItem('expr_v3_key');
    $('toggle-key').onclick = () => {
      const visible = $('access-key').type === 'password';
      $('access-key').type = visible ? 'text' : 'password';
      $('toggle-key').textContent = visible ? '隐藏' : '显示';
      $('toggle-key').setAttribute('aria-label', visible ? '隐藏 API Key' : '显示 API Key');
      $('toggle-key').setAttribute('aria-pressed', String(visible));
    };
    $('key-form').onsubmit = event => { event.preventDefault(); this.useKey(); };
    $('show-purchase').onclick = () => {
      const hidden = $('purchase-panel').classList.toggle('hidden');
      $('show-purchase').setAttribute('aria-expanded', String(!hidden));
      this.refreshConfig();
    };
    $('show-redeem').onclick = () => {
      $('redeem-form').classList.remove('hidden');
      $('show-redeem').setAttribute('aria-expanded', 'true');
      $('activation-code').focus();
    };
    $('redeem-form').onsubmit = event => { event.preventDefault(); this.redeem(); };
    $('managed-start').onclick = () => this.useManaged();
    $('recover-session').onclick = () => this.recoverSession();
    await this.refreshConfig();
    if (!this.authToken) {
      this.renderAccountStatus();
      this.openLogin();
      this.updateStatus();
      return;
    }
    this.updateAdminButton();
    this.renderAccountStatus();
    // When managed billing is disabled, establish the user's AI connection once
    // at startup. Every later feature reuses this verified browser credential.
    if (!this.serverAiAvailable && !this.key && this.config.managedBillingEnabled === false) {
      setTimeout(() => this.open('setup'), 0);
    }
    // Only recover the session owned by this tab. Other tabs cannot stop it.
    if (recoveryId && this.token) {
      try { await this.api(`/api/sessions/${recoveryId}/stop`, {}); } catch (_) {}
      this.sessionId = ''; sessionStorage.removeItem('expr_v3_session');
    }
    if (this.token) await this.refreshAccount();
    this.updateStatus();
  }
  async api(path, body, options = {}) {
    let response;
    try {
      response = await fetch(runtimeApiUrl(path), {
        method: body === undefined ? 'GET' : 'POST',
        headers: { 'Content-Type': 'application/json', ...((this.authToken || this.token) ? { Authorization: `Bearer ${this.authToken || this.token}` } : {}) },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
        signal: AbortSignal.timeout(path.includes('/ai/') ? 90000 : 20000),
        ...options
      });
    } catch (_) { throw new Error('本地服务未启动，请先运行启动脚本。'); }
    let data;
    try { data = await response.json(); } catch (_) { throw new Error('服务暂时无法连接，请稍后重试。'); }
    if (!response.ok) throw new Error(data.message || '操作未完成，请稍后重试。');
    return data;
  }
  openLogin() {
    this.loginDialog?.classList.add('is-page');
    const note = document.getElementById('login-note');
    if (note && this.demoMode) {
      note.textContent = this.readDemoAccount()
        ? '请输入你在此浏览器注册的手机号和密码。'
        : '第一次使用请先点“注册新账号”，账号只保存在当前浏览器。';
    }
    if (!this.loginDialog?.open) this.loginDialog?.showModal();
    document.getElementById('login-phone')?.focus();
  }
  renderAccountStatus() {
    const badge = document.getElementById('account-status-badge');
    const copy = document.getElementById('account-status-copy');
    const identity = document.getElementById('account-status-identity');
    const username = document.getElementById('account-status-username');
    const phone = document.getElementById('account-status-phone');
    const login = document.getElementById('btn-account-login');
    const logout = document.getElementById('btn-account-logout');
    const loggedIn = !!this.user;
    if (badge) { badge.textContent = loggedIn ? '已登录' : '未登录'; badge.classList.toggle('is-active', loggedIn); }
    identity?.classList.toggle('hidden', !loggedIn);
    if (username) username.textContent = loggedIn ? (this.user.username || '未设置昵称') : '';
    if (phone) phone.textContent = loggedIn ? `手机号：${this.maskPhone(this.user.phone)}` : '';
    if (copy) copy.textContent = loggedIn ? '练习记录与成长档案已同步。' : '登录后，练习记录、成长档案和 AI 分析会跟着账号保存。';
    login?.classList.toggle('hidden', loggedIn);
    logout?.classList.toggle('hidden', !loggedIn);
  }
  maskPhone(phone = '') {
    const value = String(phone);
    return value.length >= 7 ? `${value.slice(0, 3)}****${value.slice(-4)}` : value;
  }
  readDemoAccount() {
    try {
      const value = JSON.parse(localStorage.getItem('expr_demo_account') || 'null');
      return value && value.phone && value.password ? value : null;
    } catch (_) { return null; }
  }
  async loginDemo() {
    const phone = document.getElementById('login-phone').value.trim();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    const isRegister = this.loginMode === 'register';
    const confirm = document.getElementById('login-confirm').value;
    const message = document.getElementById('login-message');
    const submit = document.getElementById('login-submit');
    if (!phone || password.length < 8) { message.textContent = '请输入手机号和至少 8 位密码。'; message.classList.add('is-error'); return; }
    if (isRegister && username && (username.length < 2 || username.length > 20)) { message.textContent = '用户名请使用 2—20 个字。'; message.classList.add('is-error'); return; }
    if (isRegister && password !== confirm) { message.textContent = '两次输入的密码不一致。'; message.classList.add('is-error'); return; }
    submit.disabled = true; message.classList.remove('is-error'); message.textContent = isRegister ? '正在创建账号…' : '正在登录…';
    try {
      const existing = this.readDemoAccount();
      if (isRegister) {
        if (existing?.phone === phone) throw new Error('这个手机号已经注册，请直接登录。');
        this.demoAccount = { phone, username: username || `用户${phone.slice(-4)}`, password, role: 'user', status: 'active' };
        localStorage.setItem('expr_demo_account', JSON.stringify(this.demoAccount));
      } else {
        if (!existing || existing.phone !== phone || existing.password !== password) throw new Error('手机号或密码不正确。');
        this.demoAccount = existing;
      }
      this.user = { ...this.demoAccount };
      this.authToken = 'demo-local'; this.demoSession = true;
      localStorage.setItem('expr_demo_session', '1');
      const pendingAction = this.pending;
      this.loginDialog.close(); this.loginDialog.classList.remove('is-page');
      this.updateAdminButton(); this.renderAccountStatus(); message.textContent = '';
      this.updateStatus();
      if (pendingAction === 'settings') this.open('settings');
      else if (pendingAction) { this.pending = pendingAction; await this.continueAction(); }
    } catch (error) { message.textContent = error.message; message.classList.add('is-error'); }
    finally { submit.disabled = false; }
  }
  async logout() {
    if (this.demoMode) {
      this.authToken = ''; this.user = null; this.demoSession = false;
      localStorage.removeItem('expr_demo_session');
      this.updateAdminButton(); this.renderAccountStatus(); this.updateStatus();
      this.close(); this.openLogin();
      return;
    }
    try { if (this.authToken) await this.api('/api/auth/logout', {}); } catch (_) {}
    this.authToken = ''; this.user = null;
    localStorage.removeItem('expr_v7_auth_token');
    this.updateAdminButton(); this.renderAccountStatus(); this.updateStatus();
    this.close();
    if (this.loginMode === 'register') this.toggleLoginMode();
    this.openLogin();
  }
  updateAdminButton() {
    const button = document.getElementById('btn-admin-accounts');
    if (button) button.classList.toggle('hidden', this.user?.role !== 'admin');
    const dashboard = document.getElementById('btn-admin-dashboard');
    if (dashboard) dashboard.classList.toggle('hidden', this.user?.role !== 'admin');
    this.renderAccountStatus();
  }
  async refreshAccountStats() {
    // Practice totals belong in 成长档案; 账号设置只显示身份和登录状态.
  }
  openAdminAccounts() {
    if (this.user?.role !== 'admin') return;
    this.adminDialog?.showModal();
    document.getElementById('admin-account-phone')?.focus();
  }
  openAdminStats() {
    if (this.user?.role !== 'admin') return;
    this.adminStatsDialog?.showModal();
    this.refreshAdminStats();
  }
  renderAdminStats(data = null) {
    const message = document.getElementById('admin-stats-message');
    const list = document.getElementById('admin-stats-list');
    if (!message || !list || !data) return;
    const summary = data.summary || {};
    const set = (id, value) => { const node = document.getElementById(id); if (node) node.textContent = String(value ?? 0); };
    set('admin-total-users', summary.totalAccounts);
    set('admin-active-users', summary.activeAccounts);
    set('admin-completed-sessions', summary.completedSessions);
    set('admin-total-minutes', Math.floor((summary.totalSeconds || 0) / 60));
    set('admin-report-count', summary.reportCount);
    const escape = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
    const date = (value) => value ? new Date(value).toLocaleDateString('zh-CN') : '还没有练习';
    list.innerHTML = (data.accounts || []).map((account) => `<div class="admin-stats-row"><div><strong>${escape(account.username || this.maskPhone(account.phone))}</strong><span>${escape(this.maskPhone(account.phone))} · ${account.role === 'admin' ? '管理员' : '普通用户'} · ${account.status === 'active' ? '正常' : '已暂停'}</span></div><div><b>${account.completedSessions || 0}</b><span>次练习</span></div><div><b>${Math.floor((account.totalSeconds || 0) / 60)}</b><span>分钟</span></div><div><b>${account.reportCount || 0}</b><span>份 AI 分析</span></div><div><span>最近：${escape(date(account.lastPracticeAt))}</span></div></div>`).join('');
    message.textContent = `${summary.totalAccounts ?? data.accounts?.length ?? 0} 个账号，数据已更新。`;
  }
  async refreshAdminStats() {
    if (this.user?.role !== 'admin') return;
    const message = document.getElementById('admin-stats-message');
    if (message) message.textContent = '正在读取数据…';
    try { this.renderAdminStats(await this.api('/api/admin/stats')); }
    catch (error) { if (message) message.textContent = error.message || '数据暂时无法读取。'; }
  }
  async createAccountFromAdmin() {
    if (this.user?.role !== 'admin') return;
    const phone = document.getElementById('admin-account-phone').value.trim();
    const username = document.getElementById('admin-account-username').value.trim();
    const password = document.getElementById('admin-account-password').value;
    const role = document.getElementById('admin-account-role').value;
    const message = document.getElementById('admin-account-message');
    const submit = document.getElementById('admin-account-submit');
    if (!phone || password.length < 8) { message.textContent = '请输入手机号和至少 8 位初始密码。'; message.classList.add('is-error'); return; }
    if (username && (username.length < 2 || username.length > 20)) { message.textContent = '用户名请使用 2—20 个字。'; message.classList.add('is-error'); return; }
    submit.disabled = true; message.classList.remove('is-error'); message.textContent = '正在创建…';
    try {
      const data = await this.api('/api/admin/accounts', { phone, username, password, role });
      message.textContent = `账号已创建：${data.account.phone}`;
      document.getElementById('admin-account-form').reset();
    } catch (error) { message.textContent = error.message; message.classList.add('is-error'); }
    finally { submit.disabled = false; }
  }
  async login() {
    if (this.demoMode) return this.loginDemo();
    const phone = document.getElementById('login-phone').value.trim();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    const isRegister = this.loginMode === 'register';
    const confirm = document.getElementById('login-confirm').value;
    const message = document.getElementById('login-message');
    const submit = document.getElementById('login-submit');
    if (!phone || password.length < 8) { message.textContent = '请输入手机号和至少 8 位密码。'; message.classList.add('is-error'); return; }
    if (isRegister && username && (username.length < 2 || username.length > 20)) { message.textContent = '用户名请使用 2—20 个字。'; message.classList.add('is-error'); return; }
    if (isRegister && password !== confirm) { message.textContent = '两次输入的密码不一致。'; message.classList.add('is-error'); return; }
    submit.disabled = true; message.classList.remove('is-error'); message.textContent = isRegister ? '正在创建账号…' : '正在登录…';
    try {
      const data = await this.api(isRegister ? '/api/auth/register' : '/api/auth/login', isRegister ? { phone, password, username } : { phone, password });
      const pendingAction = this.pending;
      this.authToken = data.token; this.user = data.account;
      localStorage.setItem('expr_v7_auth_token', this.authToken);
      this.loginDialog.close();
      this.loginDialog.classList.remove('is-page');
      this.updateAdminButton();
      this.renderAccountStatus();
      message.textContent = '';
      await this.refreshAccount();
      this.updateStatus();
      if (!this.serverAiAvailable && !this.key && this.config.managedBillingEnabled === false) setTimeout(() => this.open('setup'), 0);
      else if (pendingAction) setTimeout(() => this.open(pendingAction), 0);
    } catch (error) { message.textContent = error.message; message.classList.add('is-error'); }
    finally { submit.disabled = false; }
  }
  toggleLoginMode() {
    this.loginMode = this.loginMode === 'login' ? 'register' : 'login';
    const register = this.loginMode === 'register';
    document.getElementById('login-title').textContent = register ? '注册表达宇宙·达达口才训练' : '登录表达宇宙·达达口才训练';
    document.getElementById('login-submit').textContent = register ? '注册并开始' : '登录';
    document.getElementById('login-register').textContent = register ? '已有账号？返回登录' : '注册新账号';
    document.getElementById('login-confirm-row').classList.toggle('hidden', !register);
    document.getElementById('login-username-row').classList.toggle('hidden', !register);
    document.getElementById('login-confirm').required = register;
    document.getElementById('login-password').autocomplete = register ? 'new-password' : 'current-password';
    document.getElementById('login-message').textContent = '';
    document.getElementById('login-message').classList.remove('is-error');
    document.getElementById('login-note').textContent = '登录后即可继续练习。';
    document.getElementById('login-phone').focus();
  }
  async refreshConfig() {
    // A fast click can call open() while init() is still loading. Reuse the
    // same request so recovery and the first action share one initialization
    // gate instead of racing with two independent config reads.
    if (this.configPromise) return this.configPromise;
    this.configPromise = (async () => {
      try { this.config = await this.api('/api/config'); } catch (_) { this.config = {}; }
      this.applyConfig();
    })();
    try { return await this.configPromise; }
    finally { this.configPromise = null; }
  }
  applyConfig() {
    this.serverAiAvailable = this.config.serverAiAvailable === true;
    this.setAIConnectionStatus(this.serverAiAvailable ? '已配置，待检查' : '未配置', this.serverAiAvailable ? 'pending' : 'error');
    const betaMode = this.config.betaMode === true;
    document.getElementById('login-register')?.classList.toggle('hidden', !betaMode);
    if (!betaMode && this.loginMode === 'register') this.toggleLoginMode();
    document.getElementById('login-note').textContent = betaMode ? '登录后即可继续练习。' : '账号由管理员发放。如需开通或重置密码，请联系管理员。';
    if (this.serverAiAvailable) {
      this.mode = 'server';
      this.key = '';
      localStorage.setItem('expr_v3_mode', 'server');
      localStorage.removeItem('expr_v3_key');
      sessionStorage.removeItem('expr_v3_key');
    }
    const billingEnabled = this.config.managedBillingEnabled !== false;
    const managedSection = document.querySelector('.managed-section');
    managedSection?.classList.toggle('hidden', !billingEnabled);
    document.getElementById('access-title').textContent = this.pending === 'settings' ? '账号设置' : '开始练习';
    const keyOption = document.getElementById('key-option');
    // The HTML starts this section hidden so server-managed mode never flashes
    // a provider-key form. If the server key is unavailable, explicitly reveal
    // the fallback form; otherwise a billing-disabled local preview would show
    // an empty access dialog with no way to connect AI.
    const showKeyOption = !betaMode && !this.serverAiAvailable && (!billingEnabled || !!this.pasted);
    keyOption.classList.toggle('hidden', !showKeyOption);
    keyOption.open = showKeyOption;
    keyOption.setAttribute('aria-hidden', String(!showKeyOption));
    managedSection?.classList.toggle('hidden', betaMode || !billingEnabled);
    const available = !!this.config.managedAvailable;
    document.getElementById('managed-unavailable').classList.toggle('hidden', available);
    const image = document.getElementById('payment-qr');
    // Show the supplied QR in preview, but clearly block an invitation to pay
    // until the managed service and contact instructions are configured.
    const hasQr = !!this.config.paymentQrUrl;
    const canPurchase = available && hasQr && !!this.config.supportText;
    if (hasQr) image.src = this.config.paymentQrUrl;
    image.classList.toggle('hidden', !hasQr);
    const notice = document.getElementById('purchase-unavailable');
    notice.classList.toggle('hidden', canPurchase);
    notice.textContent = hasQr ? '当前仅供预览，暂勿付款。' : '收款码待配置，暂未开放购买。';
    document.getElementById('purchase-contact').textContent = this.config.supportText || '';
    document.querySelector('.purchase-detail h3').textContent = '支付宝扫码 · ¥29.9';
    this.renderBalance();
  }
  async refreshAccount() {
    try { const data = await this.api('/api/account'); this.setBalance(data); this.previousSession = data.activeSession; }
    catch (_) { this.balance = 0; this.remainingUses = 0; this.pendingPacks = 0; }
    document.getElementById('recover-session').classList.toggle('hidden', !this.previousSession);
    this.renderBalance(); this.updateStatus();
  }
  async recoverSession() {
    if (this.busy || !this.previousSession) return;
    this.setBusy(true);
    try {
      await this.api(`/api/sessions/${this.previousSession.sessionId}/stop`, {});
      this.previousSession = null;
      await this.refreshAccount();
      this.message('上次计时已结束，现在可以开始新练习。');
    } catch (error) { this.message(error.message, true); }
    finally { this.setBusy(false); }
  }
  renderBalance() {
    document.getElementById('balance-area').classList.toggle('hidden', !this.token);
    document.getElementById('balance-value').textContent = `${this.remainingUses} 次 · ${this.formatTime(this.balance)}`;
    const packs = document.getElementById('pending-packs');
    packs.textContent = this.pendingPacks > 0 ? `另有 ${this.pendingPacks} 个套餐待使用` : '';
    packs.classList.toggle('hidden', this.pendingPacks <= 0);
    document.getElementById('managed-start').disabled = this.busy || this.config.managedBillingEnabled === false || !this.config.managedAvailable || this.balance <= 0 || this.remainingUses <= 0 || this.pasted;
  }
  setBalance(data) {
    this.balance = Math.max(0, Number(data.remainingSeconds) || 0);
    this.remainingUses = Math.max(0, Number(data.remainingUses) || 0);
    this.pendingPacks = Math.max(0, Number(data.pendingPacks) || 0);
  }
  formatTime(seconds) {
    const n = Math.max(0, Math.ceil(seconds || 0));
    return `${Math.floor(n / 60).toString().padStart(2, '0')}:${(n % 60).toString().padStart(2, '0')}`;
  }
  updateStatus() {
    document.getElementById('access-status').textContent = this.mode === 'managed' && this.token
      ? `练习套餐 · 还可开始 ${this.remainingUses} 次 · 剩余 ${this.formatTime(this.balance)}`
      : this.user
      ? `${this.user.phone} · 已登录`
      : this.key ? 'DeepSeek · 使用自己的 API Key' : '开始前，选择你的 AI 使用方式';
  }
  open(action = 'record', pasted = false) {
    if (window.trainer?.isRecording) return;
    if (this.demoMode) {
      this.pending = action;
      this.pasted = pasted;
      if (!this.user) { this.openLogin(); return; }
      if (action === 'settings') {
        this.renderAccountStatus();
        this.checkServerAIStatus({ silent: true });
        document.getElementById('account-settings-section')?.classList.remove('hidden');
        this.dialog.showModal();
        return;
      }
      this.continueAction().catch(error => this.message(error.message, true));
      return;
    }
    if (!this.authToken) { this.pending = action; this.openLogin(); return; }
    if (this.mode === 'server' && !pasted && action !== 'settings' && action !== 'setup') {
      this.pending = action;
      this.continueAction().catch(error => this.message(error.message, true));
      return;
    }
    // A verified BYOK key is session-wide. Do not interrupt every feature with
    // the same dialog; only the explicit Settings/Manage action opens it.
    if (action !== 'settings' && action !== 'setup' && !pasted && this.mode === 'byok' && this.key) {
      this.pending = action;
      this.pasted = pasted;
      this.continueAction().catch(error => this.message(error.message, true));
      return;
    }
    this.pending = action; this.pasted = pasted;
    document.getElementById('access-title').textContent = action === 'settings' ? '账号设置' : '开始练习';
    document.getElementById('account-settings-section')?.classList.toggle('hidden', action !== 'settings');
    this.renderAccountStatus();
    if (action === 'settings') this.checkServerAIStatus({ silent: true });
    document.getElementById('key-submit').textContent = action === 'setup' ? '验证并保存' : action === 'record' ? '验证并开始' : action === 'report' ? '验证并生成报告' : '验证并保存';
    document.getElementById('managed-start').textContent = action === 'record' ? '开始录制' : '使用练习套餐';
    document.getElementById('access-key').value = this.key;
    this.message(pasted ? '粘贴逐字稿的 AI 分析请使用自己的 Key；练习套餐用于录制训练。' : '');
    document.getElementById('purchase-panel').classList.add('hidden');
    document.getElementById('redeem-form').classList.add('hidden');
    document.getElementById('show-purchase').setAttribute('aria-expanded', 'false');
    document.getElementById('show-redeem').setAttribute('aria-expanded', 'false');
    document.getElementById('key-option').open = this.config.managedBillingEnabled === false || !!pasted;
    this.dialog.showModal();
    this.refreshConfig();
    if (this.token) this.refreshAccount();
  }
  setAIConnectionStatus(text, state = 'pending') {
    const node = document.getElementById('ai-connection-status');
    if (!node) return;
    node.textContent = text;
    node.classList.remove('is-pending', 'is-ok', 'is-error');
    node.classList.add('is-' + state);
  }
  async checkServerAIStatus(options = {}) {
    if (this.demoMode) {
      this.setAIConnectionStatus('本地练习反馈', 'ok');
      return { connected: true, demo: true };
    }
    this.setAIConnectionStatus('检查中…', 'pending');
    try {
      const status = await this.api('/api/ai/status');
      if (status.connected) this.setAIConnectionStatus('已连接', 'ok');
      else if (status.configured) this.setAIConnectionStatus('服务未连通', 'error');
      else this.setAIConnectionStatus('未配置', 'error');
      return status;
    } catch (error) {
      this.setAIConnectionStatus('检查失败', 'error');
      if (!options.silent) this.message(error.message || '暂时无法检查 AI 连接。', true);
      return { connected: false };
    }
  }
  close() {
    if (!this.busy) { this.pending = null; this.dialog.close(); }
  }
  message(text, error = false) {
    const el = document.getElementById('access-message'); el.textContent = text;
    el.classList.toggle('is-error', error);
  }
  setBusy(busy) {
    this.busy = busy;
    ['key-submit', 'redeem-submit', 'access-close', 'access-key', 'activation-code'].forEach(id => document.getElementById(id).disabled = busy);
    this.renderBalance();
  }
  async useKey() {
    if (this.busy) return;
    const key = document.getElementById('access-key').value.trim();
    if (!key) return this.message('请填写 DeepSeek API Key。', true);
    this.setBusy(true); this.message('正在验证 DeepSeek 连接…');
    try {
      await this.api('/api/verify-key', { apiKey: key });
      this.key = key; this.mode = 'byok';
      const remember = document.getElementById('remember-key').checked;
      localStorage.removeItem('expr_v3_key'); sessionStorage.removeItem('expr_v3_key');
      (remember ? localStorage : sessionStorage).setItem('expr_v3_key', key);
      localStorage.setItem('expr_v3_mode', this.mode);
      this.message('连接成功。');
      await this.continueAction();
    } catch (error) { this.message(error.message, true); }
    finally { this.setBusy(false); this.updateStatus(); }
  }
  async redeem() {
    if (this.busy) return;
    const code = document.getElementById('activation-code').value.trim();
    if (!code) return this.message('请先粘贴激活码。', true);
    this.setBusy(true); this.message('正在激活…');
    try {
      const data = await this.api('/api/redeem', { code });
      this.token = data.token; this.setBalance(data);
      localStorage.setItem('expr_v3_token', this.token);
      document.getElementById('activation-code').value = '';
      this.message('兑换成功，点击「开始录制」即可练习。');
    } catch (error) { this.message(error.message, true); }
    finally { this.setBusy(false); }
  }
  async useManaged() {
    if (this.busy || this.pasted) return;
    this.setBusy(true); this.message('正在准备…');
    try {
      this.mode = 'managed'; localStorage.setItem('expr_v3_mode', this.mode);
      await this.continueAction();
    } catch (error) { this.message(error.message, true); }
    finally { this.setBusy(false); this.updateStatus(); }
  }
  async continueAction() {
    const action = this.pending;
    await this.ready;
    await this.queue;
    if (action === 'record') {
      if (!(window.SpeechRecognition || window.webkitSpeechRecognition)) throw new Error('当前浏览器不支持语音识别。请换用支持语音识别的浏览器，或粘贴逐字稿分析。');
      if (this.mode === 'managed') {
        const data = await this.api('/api/sessions', {});
        this.sessionId = data.sessionId; this.setBalance(data);
        sessionStorage.setItem('expr_v3_session', this.sessionId);
      } else this.sessionId = '';
      this.authorizedRecording = true;
      this.dialog.close(); this.pending = null;
      window.trainer.startRecording();
    } else {
      this.dialog.close(); this.pending = null;
      if (action === 'report') window.trainer.generateReport();
    }
  }
  canAnalyze(pasted = false) {
    if (this.mode === 'demo') return !pasted;
    if (this.mode === 'server') return this.serverAiAvailable && !pasted;
    return this.mode === 'byok' ? !!this.key : !!this.token && !!this.sessionId && !pasted;
  }
  enqueue(action) {
    const id = this.sessionId;
    if (this.mode !== 'managed' || !id) return Promise.resolve();
    const task = this.queue.catch(() => {}).then(async () => {
      const observedAt = Date.now();
      const data = await this.api(`/api/sessions/${id}/${action}`, {});
      this.syncDeadline(data, observedAt);
      this.setBalance(data); this.renderBalance(); this.updateStatus();
      if (data.status === 'stopped' && window.trainer.isRecording) {
        window.trainer.stopRecording();
        window.trainer.addFeedbackItem(this.balance <= 0 ? '本套餐已用完，录制已停止。这次练习仍可生成报告。' : '计时连接已结束，本次录制已保存。', 'ai');
      }
      return data;
    });
    this.queue = task.catch(() => {});
    return task;
  }
  syncDeadline(data, observedAt = Date.now()) {
    clearTimeout(this.expiryTimeout);
    if (data.status !== 'active') return;
    // Count down locally too, so the recording need not wait for another heartbeat.
    // Start from request time to avoid adding the response's network latency.
    const delay = Math.max(0, Number(data.remainingSeconds) * 1000 - (Date.now() - observedAt));
    this.expiryTimeout = setTimeout(() => {
      if (this.mode !== 'managed' || !window.trainer.isRecording || window.trainer.isPaused) return;
      window.trainer.stopRecording();
      window.trainer.addFeedbackItem('练习时长已用完，录制已停止。逐字稿已保留，可以生成报告。', 'ai');
    }, delay);
  }
  async recordingStarted() {
    if (this.mode !== 'managed') return;
    if (!window.trainer.isRecording || window.trainer.isPaused) return;
    await this.enqueue('resume');
    clearInterval(this.heartbeat);
    if (!window.trainer.isRecording || window.trainer.isPaused) return;
    this.heartbeat = setInterval(() => {
      if (this.heartbeatPending) return;
      this.heartbeatPending = true;
      this.enqueue('heartbeat').catch(error => {
        window.trainer.stopRecording(); window.trainer.showError(error.message + ' 录制已停止，逐字稿已保留。');
      }).finally(() => { this.heartbeatPending = false; });
    }, 5000);
  }
  recordingPaused() {
    clearTimeout(this.expiryTimeout);
    clearInterval(this.heartbeat);
    this.enqueue('pause').catch(error => { window.trainer.showError(error.message); });
  }
  recordingEnded() {
    clearTimeout(this.expiryTimeout);
    this.authorizedRecording = false; clearInterval(this.heartbeat);
    return this.enqueue('stop').then(async () => {
      sessionStorage.removeItem('expr_v3_session');
      if (this.mode === 'managed') await this.refreshAccount();
    }).catch(error => { window.trainer.showError(error.message); });
  }
  callAI(messages, maxTokens) {
    const mode = this.mode;
    const sessionId = this.sessionId;
    const key = this.key;
    const task = this.aiQueue.catch(() => {}).then(() => this.sendAI(messages, maxTokens, mode, sessionId, key));
    this.aiQueue = task.catch(() => {});
    return task;
  }
  async sendAI(messages, maxTokens, mode, sessionId, key) {
    this.lastError = '';
    if (mode === 'demo') {
      const text = messages.filter(item => item?.role === 'user').at(-1)?.content || '';
      const hasDetail = /(看见|看到|听见|听到|当时|那一刻|突然|画面|动作|后来|结果|最后)/.test(text);
      if (maxTokens > 1000) {
        return `这是一份练习反馈：\n\n你已经把想法说出来了。${hasDetail ? '你提到了具体的画面或过程，听的人更容易跟上。' : '下次可以加一个具体瞬间、动作或画面。'}\n\n继续练习“事情发生了什么 → 你的感受 → 后来怎么样”，表达会越来越清楚。`;
      }
      if (/最近|进步|变化/.test(text)) return '你已经开始把事情说出来了。继续留意“发生了什么、后来怎样”，再加一个具体的动作或画面，听的人就更容易跟上。';
      if (/下一次|下次|练什么/.test(text)) return '下一次先练一件小事：按“事情 → 原因 → 结果 → 感受”说一遍，最后补一个具体瞬间。';
      if (/哪次|最好|完整/.test(text)) return '可以回看你说到具体人物、动作和结果的那一次。能让别人脑中出现画面，就是很棒的进步。';
      return hasDetail ? '你说到了具体细节，继续补充结果或感受。' : '可以加一个具体瞬间、动作或画面。';
    }
    if (mode === 'server') {
      return (await this.api('/api/ai/server', { messages, maxTokens })).content;
    }
    if (mode === 'byok') {
      if (!key) throw new Error('请先填写 DeepSeek API Key。');
      return (await this.api('/api/ai/byok', { apiKey: key, messages, maxTokens })).content;
    }
    await this.queue;
    if (!sessionId) throw new Error('请先激活练习套餐并完成一次录制。');
    return (await this.api('/api/ai/managed', {
      sessionId, messages, maxTokens, kind: maxTokens > 1000 ? 'report' : 'realtime'
    })).content;
  }
}
