(function () {
    const page = location.pathname.split('/').pop();
    document.getElementById('app-nav').innerHTML = `
        <nav class="bg-blue-700 text-white px-6 py-3 flex items-center justify-between shadow">
            <span class="font-bold text-lg tracking-wide">Phản Hồi Khách Hàng</span>
            <div class="flex gap-6 text-sm font-medium">
                <a href="submit.html"
                   class="hover:underline ${page === 'submit.html' ? 'underline' : 'opacity-80 hover:opacity-100'}">
                    Gửi Phản Hồi
                </a>
                <a href="admin.html"
                   class="hover:underline ${page === 'admin.html' ? 'underline' : 'opacity-80 hover:opacity-100'}">
                    Quản Trị
                </a>
            </div>
        </nav>
    `;
}());
