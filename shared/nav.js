(function () {
    const page = location.pathname.replace(/\/$/, '').split('/').pop();

    function link(href, label, active) {
        return `<a href="${href}" style="text-decoration:none;padding:6px 14px;border-radius:8px;font-size:0.8125rem;font-weight:500;transition:background 0.15s,color 0.15s;cursor:pointer;${
            active
                ? 'background:rgba(255,255,255,0.1);color:#f8fafc;'
                : 'color:#64748b;'
        }"
        onmouseover="if(!${active})this.style.background='rgba(255,255,255,0.06)';if(!${active})this.style.color='#f8fafc'"
        onmouseout="if(!${active})this.style.background='';if(!${active})this.style.color='#64748b'"
        >${label}</a>`;
    }

    document.getElementById('app-nav').innerHTML = `
        <nav style="background:#0f172a;border-bottom:1px solid rgba(255,255,255,0.06);padding:0 1.5rem;">
            <div style="max-width:72rem;margin:0 auto;display:flex;align-items:center;justify-content:space-between;height:3.5rem;">
                <a href="/submit" style="display:flex;align-items:center;gap:8px;text-decoration:none;cursor:pointer;">
                    <div style="width:28px;height:28px;border-radius:8px;background:rgba(74,222,128,0.12);border:1px solid rgba(74,222,128,0.2);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#4ade80" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-3 3v-3z"/>
                        </svg>
                    </div>
                    <span style="color:#f8fafc;font-weight:600;font-size:0.9rem;letter-spacing:-0.01em;">HSB Feedback</span>
                </a>
                <div style="display:flex;align-items:center;gap:4px;">
                    ${link('/submit', 'Gửi Phản Hồi', page === 'submit')}
                    ${link('/admin', 'Quản Trị', page === 'admin')}
                </div>
            </div>
        </nav>
    `;
}());
