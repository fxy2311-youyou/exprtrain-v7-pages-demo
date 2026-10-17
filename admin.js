const runtimeApiBase = String(window.EXPR_RUNTIME_CONFIG?.apiBaseUrl || '').replace(/\/+$/, '');
const runtimeApiUrl = (path) => runtimeApiBase ? `${runtimeApiBase}${path}` : path;
const tokenKey = 'expr_v7_auth_token';
const $ = (id) => document.getElementById(id);
const escapeHTML = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[character]));
const maskPhone = (phone = '') => { const value = String(phone); return value.length >= 7 ? `${value.slice(0, 3)}****${value.slice(-4)}` : value; };
const dateText = (value) => value ? new Date(value).toLocaleDateString('zh-CN') : '还没有练习';
const api = async (path, body) => {
  const response = await fetch(runtimeApiUrl(path), { method: body === undefined ? 'GET' : 'POST', headers: { 'Content-Type':'application/json', ...(localStorage.getItem(tokenKey) ? { Authorization:`Bearer ${localStorage.getItem(tokenKey)}` } : {}) }, ...(body === undefined ? {} : { body:JSON.stringify(body) }) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || '操作未完成，请稍后重试。');
  return data;
};
function showLogin(message = '') { $('admin-login').classList.remove('hidden'); $('admin-dashboard').classList.add('hidden'); $('admin-logout').classList.add('hidden'); $('admin-login-message').textContent = message; }
function showDashboard() { $('admin-login').classList.add('hidden'); $('admin-dashboard').classList.remove('hidden'); $('admin-logout').classList.remove('hidden'); }
function renderAIConfig(data) {
  $('admin-ai-endpoint').value = data.endpoint || '';
  const status = $('admin-ai-status');
  status.textContent = data.hasKey ? `已配置 · ${data.maskedKey}` : '未配置';
  status.classList.toggle('is-empty', !data.hasKey);
  $('admin-ai-meta').textContent = `${data.model || '当前模型'}${data.updatedAt ? ` · 最近更新：${dateText(data.updatedAt)}` : ''}`;
}
function renderStats(data) {
  const summary = data.summary || {};
  $('admin-total-users').textContent = summary.totalAccounts ?? 0;
  $('admin-active-users').textContent = summary.activeAccounts ?? 0;
  $('admin-completed-sessions').textContent = summary.completedSessions ?? 0;
  $('admin-total-minutes').textContent = Math.floor((summary.totalSeconds || 0) / 60);
  $('admin-report-count').textContent = summary.reportCount ?? 0;
  $('admin-message').textContent = `${summary.totalAccounts ?? data.accounts?.length ?? 0} 个账号，数据已更新。`;
  $('admin-account-list').innerHTML = (data.accounts || []).map((account) => `<div class="admin-account-row"><div><strong>${escapeHTML(account.username || maskPhone(account.phone))}</strong><span>${escapeHTML(maskPhone(account.phone))} · ${account.role === 'admin' ? '管理员' : '普通用户'} · ${account.status === 'active' ? '正常' : '已暂停'}</span></div><div><b>${account.completedSessions || 0}</b><span>次练习</span></div><div><b>${Math.floor((account.totalSeconds || 0) / 60)}</b><span>分钟</span></div><div><b>${account.reportCount || 0}</b><span>份 AI 分析</span></div><div><span>最近：${escapeHTML(dateText(account.lastPracticeAt))}</span></div></div>`).join('') || '<p>暂时还没有账号记录。</p>';
}
async function refresh() { $('admin-message').textContent = '正在读取数据…'; try { renderStats(await api('/api/admin/stats')); } catch (error) { $('admin-message').textContent = error.message; } }
async function refreshAIConfig() { $('admin-ai-message').textContent = '正在读取 AI 配置…'; try { renderAIConfig(await api('/api/admin/ai-config')); $('admin-ai-message').textContent = ''; } catch (error) { $('admin-ai-message').textContent = error.message; } }
async function boot() {
  try { const account = await api('/api/auth/me'); if (account.role !== 'admin') throw new Error('这个账号没有管理员权限。'); showDashboard(); await Promise.all([refresh(), refreshAIConfig()]); }
  catch (error) { localStorage.removeItem(tokenKey); showLogin(error.message === '这个账号没有管理员权限。' ? error.message : '请登录管理员账号。'); }
}
$('admin-login-form').onsubmit = async (event) => { event.preventDefault(); const message = $('admin-login-message'); message.textContent = '正在登录…'; try { const data = await api('/api/auth/login', { phone:$('admin-login-phone').value.trim(), password:$('admin-login-password').value }); localStorage.setItem(tokenKey, data.token); if (data.account.role !== 'admin') throw new Error('这个账号没有管理员权限。'); showDashboard(); await refresh(); } catch (error) { localStorage.removeItem(tokenKey); message.textContent = error.message; } };
$('admin-refresh').onclick = refresh;
$('admin-logout').onclick = async () => { try { await api('/api/auth/logout', {}); } catch (_) {} localStorage.removeItem(tokenKey); showLogin('已退出管理员后台。'); };
$('admin-account-form').onsubmit = async (event) => { event.preventDefault(); const message = $('admin-account-message'); message.textContent = '正在创建…'; try { const data = await api('/api/admin/accounts', { phone:$('admin-account-phone').value.trim(), username:$('admin-account-username').value.trim(), password:$('admin-account-password').value, role:$('admin-account-role').value }); message.textContent = `账号已创建：${data.account.phone}`; event.target.reset(); await refresh(); } catch (error) { message.textContent = error.message; } };
$('admin-ai-config-form').onsubmit = async (event) => { event.preventDefault(); const message = $('admin-ai-message'); const submit = event.target.querySelector('button[type="submit"]'); submit.disabled = true; message.textContent = '正在验证 API Key 并保存…'; try { await api('/api/admin/ai-config', { endpoint:$('admin-ai-endpoint').value.trim(), apiKey:$('admin-ai-key').value.trim() }); $('admin-ai-key').value = ''; await refreshAIConfig(); message.textContent = 'AI 配置已验证并保存。'; } catch (error) { message.textContent = error.message; } finally { submit.disabled = false; } };
$('admin-ai-clear').onclick = async () => { const message = $('admin-ai-message'); $('admin-ai-clear').disabled = true; message.textContent = '正在清除…'; try { await api('/api/admin/ai-config', { endpoint:$('admin-ai-endpoint').value.trim(), clearKey:true }); $('admin-ai-key').value = ''; await refreshAIConfig(); message.textContent = 'API Key 已清除。'; } catch (error) { message.textContent = error.message; } finally { $('admin-ai-clear').disabled = false; } };
boot();
