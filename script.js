// 全局变量
let currentUser = null;
let currentTeam = null;
let userType = null; // admin, member, guest
let checkinRecords = [];
let allMembers = ["橙子", "easy", "CT", "小之", "老四", "渣辉", "晋文公", "88", "王珈艺", "博博", "三门", "查理", "wifi", "芭乐", "鹤r", "果子", "雪子", "阿风", "阿雯", "加号", "加萨", "陈景玉", "椰子", "金志强", "Alice", "袁梦迪", "梅彧轩", "jojo", "brigs", "纪雨蕊", "Lemon", "苹果", "小鱼", "周永恩", "傅靖涵", "萧涵耀", "莎鱼", "散步", "李文慧", "米娅", "球球", "繁星", "绿痘"];
let admins = ["easy", "橙子", "查理"];
let teamMembers = {
    "进阶队": ["橙子", "easy", "CT", "小之", "老四", "渣辉", "晋文公", "88", "王珈艺", "博博", "三门"],
    "初阶队": ["查理", "wifi", "芭乐", "鹤r", "果子", "雪子", "阿风", "阿雯", "加号", "加萨", "陈景玉", "椰子", "金志强", "Alice", "袁梦迪", "梅彧轩", "jojo", "brigs", "纪雨蕊", "Lemon", "苹果", "小鱼", "周永恩", "傅靖涵", "萧涵耀", "莎鱼", "散步", "李文慧", "米娅", "球球", "繁星", "绿痘"]
};
let scoreConfig = {
    "代表参赛": 6,
    "岩馆集训": 3,
    "岩馆黑练": 2,
    "力量黑练": 2
};

// DOM元素
const loginModal = document.getElementById('loginModal');
const loginForm = document.getElementById('loginForm');
const currentUserSpan = document.getElementById('currentUser');
const logoutBtn = document.getElementById('logoutBtn');
const checkinForm = document.getElementById('checkinForm');
const checkinScreenshot = document.getElementById('checkinScreenshot');
const checkinScreenshotData = document.getElementById('checkinScreenshotData');
const preview = document.getElementById('preview');
const rankingBody = document.getElementById('rankingBody');
const recordsBody = document.getElementById('recordsBody');
const searchRecords = document.getElementById('searchRecords');
const filterType = document.getElementById('filterType');
const nicknameSelect = document.getElementById('nickname');
const teamSelect = document.getElementById('team');

// 初始化
function init() {
    // 加载数据
    loadData();
    
    // 设置默认日期
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('checkinDate').value = today;
    
    // 事件监听
    setupEventListeners();
    
    // 显示登录模态框
    loginModal.classList.add('show');
}

// 加载数据
function loadData() {
    // 从localStorage加载数据，没有则使用默认数据
    const savedRecords = localStorage.getItem('checkinRecords');
    const savedAllMembers = localStorage.getItem('allMembers');
    const savedTeamMembers = localStorage.getItem('teamMembers');
    
    if (savedRecords) {
        checkinRecords = JSON.parse(savedRecords);
        // 为现有记录添加reviewScore字段
        checkinRecords.forEach(record => {
            if (record.reviewScore === undefined) {
                record.reviewScore = 0;
            }
        });
        saveData('checkinRecords', checkinRecords);
    } else {
        // 默认数据
        checkinRecords = [
            { id: 1, name: '橙子', team: '进阶队', type: '代表参赛', date: '2024-01-01', time: '14:00', video: 'https://example.com/screenshot1', score: 6, reviewScore: 0, status: '已通过', approvedBy: '橙子', approvedTime: '2024-01-01 15:00' },
            { id: 2, name: 'easy', team: '进阶队', type: '岩馆集训', date: '2024-01-02', time: '19:00', video: 'https://example.com/screenshot2', score: 3, reviewScore: 0, status: '已通过', approvedBy: 'easy', approvedTime: '2024-01-02 20:00' },
            { id: 3, name: '查理', team: '初阶队', type: '岩馆黑练', date: '2024-01-03', time: '20:00', video: 'https://example.com/screenshot3', score: 2, reviewScore: 0, status: '已通过', approvedBy: '查理', approvedTime: '2024-01-03 21:00' }
        ];
        saveData('checkinRecords', checkinRecords);
    }
    
    // 加载成员数据
    if (savedAllMembers) {
        allMembers = JSON.parse(savedAllMembers);
    } else {
        saveData('allMembers', allMembers);
    }
    
    if (savedTeamMembers) {
        teamMembers = JSON.parse(savedTeamMembers);
    } else {
        saveData('teamMembers', teamMembers);
    }
    
    // 初始化昵称选项
    updateNicknameOptions();
}

// 更新昵称选项
function updateNicknameOptions() {
    const nicknameSelect = document.getElementById('nickname');
    
    // 清空现有选项
    nicknameSelect.innerHTML = '<option value="">请选择昵称</option>';
    
    // 添加所有成员昵称
    allMembers.forEach(nickname => {
        const option = document.createElement('option');
        option.value = nickname;
        option.textContent = nickname;
        nicknameSelect.appendChild(option);
    });
}

// 保存数据到localStorage
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// 设置事件监听
function setupEventListeners() {
    // 确保DOM元素存在
    if (!loginForm || !logoutBtn || !checkinForm) {
        console.error('无法获取必要的DOM元素');
        return;
    }
    
    // 登录类型切换
    const loginTypeSelect = document.getElementById('loginType');
    if (loginTypeSelect) {
        loginTypeSelect.addEventListener('change', toggleLoginForm);
    }
    
    // 登录表单
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleLogin(e);
    });
    
    // 退出登录
    logoutBtn.addEventListener('click', () => {
        handleLogout();
    });
    
    // 考勤打卡表单
    checkinForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleCheckin(e);
    });
    
    // 选项卡切换
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
    
    // 搜索和筛选
    if (searchRecords) {
        searchRecords.addEventListener('input', filterRecords);
    }
    if (filterType) {
        filterType.addEventListener('change', filterRecords);
    }
    
    // 排行榜切换
    const weeklyRankingBtn = document.getElementById('weeklyRanking');
    const totalRankingBtn = document.getElementById('totalRanking');
    if (weeklyRankingBtn && totalRankingBtn) {
        weeklyRankingBtn.addEventListener('click', () => {
            weeklyRankingBtn.classList.add('active');
            totalRankingBtn.classList.remove('active');
            renderRanking('weekly');
        });
        
        totalRankingBtn.addEventListener('click', () => {
            totalRankingBtn.classList.add('active');
            weeklyRankingBtn.classList.remove('active');
            renderRanking('total');
        });
    }
    
    // 队伍选择变化时更新昵称选项
    if (teamSelect) {
        teamSelect.addEventListener('change', updateNicknameOptions);
    }
    
    // 图片上传预览
    if (checkinScreenshot) {
        checkinScreenshot.addEventListener('change', handleImageUpload);
    }
    
    // 管理员功能按钮
    const adjustScoreBtn = document.getElementById('adjustScoreBtn');
    const addMemberBtn = document.getElementById('addMemberBtn');
    const deleteMemberBtn = document.getElementById('deleteMemberBtn');
    
    if (adjustScoreBtn) {
        adjustScoreBtn.addEventListener('click', adjustMemberScore);
    }
    
    if (addMemberBtn) {
        addMemberBtn.addEventListener('click', addMember);
    }
    
    if (deleteMemberBtn) {
        deleteMemberBtn.addEventListener('click', deleteMember);
    }
}

// 切换登录表单
function toggleLoginForm() {
    const loginType = document.getElementById('loginType').value;
    const memberLogin = document.getElementById('memberLogin');
    const adminLogin = document.getElementById('adminLogin');
    const teamSelect = document.getElementById('team');
    const nicknameSelect = document.getElementById('nickname');
    
    if (loginType === 'member') {
        memberLogin.style.display = 'block';
        adminLogin.style.display = 'none';
        teamSelect.required = true;
        nicknameSelect.required = true;
    } else {
        memberLogin.style.display = 'none';
        adminLogin.style.display = 'block';
        teamSelect.required = false;
        nicknameSelect.required = false;
    }
}

// 处理图片上传
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
        alert('请上传图片文件！');
        return;
    }
    
    // 检查文件大小（限制为5MB）
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
        alert('图片大小不能超过5MB！');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        // 显示预览
        preview.innerHTML = `<img src="${e.target.result}" alt="预览" />`;
        // 保存图片数据到隐藏字段
        checkinScreenshotData.value = e.target.result;
    };
    reader.readAsDataURL(file);
}

// 登录处理
function handleLogin(e) {
    e.preventDefault();
    const loginType = document.getElementById('loginType').value;
    
    if (loginType === 'member') {
        // 普通队员登录
        const nickname = document.getElementById('nickname').value;
        const team = document.getElementById('team').value;
        
        // 强制验证
        if (!nickname || !team) {
            alert('请输入昵称和队伍！');
            return;
        }
        
        // 验证昵称是否在队伍名单中，并且队伍选择正确
        const isAdvancedMember = teamMembers["进阶队"].includes(nickname);
        const isBeginnerMember = teamMembers["初阶队"].includes(nickname);
        
        if (!isAdvancedMember && !isBeginnerMember) {
            alert('您的昵称不在攀岩队名单中，无法登录！');
            return;
        }
        
        // 验证队伍选择是否正确
        if ((isAdvancedMember && team !== "进阶队") || (isBeginnerMember && team !== "初阶队")) {
            const correctTeam = isAdvancedMember ? "进阶队" : "初阶队";
            alert(`您的昵称属于${correctTeam}，请选择正确的队伍！`);
            return;
        }
        
        currentUser = nickname;
        currentTeam = team;
        
        // 确定用户类型
        if (admins.includes(nickname)) {
            userType = 'admin';
        } else {
            userType = 'member';
        }
    } else {
        // 管理员登录
        const password = document.getElementById('adminPassword').value;
        
        // 管理员密码验证
        if (password !== 'whu2026') {
            alert('管理员密码错误！');
            return;
        }
        
        currentUser = '管理员';
        currentTeam = '';
        userType = 'admin';
    }
    
    // 更新UI
    currentUserSpan.textContent = currentTeam ? `${currentUser} (${currentTeam})` : currentUser;
    
    // 隐藏登录模态框
    loginModal.classList.remove('show');
    
    // 显示主内容
    document.getElementById('mainContent').style.display = 'block';
    
    // 控制界面元素显示/隐藏
    controlUIElements();
    
    // 检查是否为管理员
    const isAdmin = admins.includes(currentUser) || currentUser === '管理员';
    
    if (isAdmin) {
        // 管理员自动切换到管理员功能选项卡
        switchTab('admin');
    } else {
        // 普通队员默认显示考勤打卡
        switchTab('checkin');
    }
    
    // 渲染页面
    renderAll();
}

// 退出登录
function handleLogout() {
    currentUser = null;
    currentTeam = null;
    userType = null;
    // 隐藏主内容
    document.getElementById('mainContent').style.display = 'none';
    // 重置所有界面元素
    document.querySelectorAll('.tab-btn').forEach(btn => btn.style.display = 'none');
    document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');
    // 显示登录模态框
    loginModal.classList.add('show');
}

// 控制UI元素显示/隐藏
function controlUIElements() {
    // 默认隐藏所有元素
    document.querySelectorAll('.tab-btn').forEach(btn => btn.style.display = 'none');
    document.querySelectorAll('.admin-only').forEach(el => el.style.display = 'none');
    
    // 只有登录用户才能看到功能
    if (currentUser) {
        // 检查是否为管理员
        const isAdmin = admins.includes(currentUser) || currentUser === '管理员';
        
        if (isAdmin) {
            // 管理员只显示管理员功能
            document.querySelectorAll('.admin-only').forEach(el => {
                if (el.classList.contains('tab-btn')) {
                    el.style.display = 'inline-block';
                } else {
                    el.style.display = 'table-cell';
                }
            });
        } else {
            // 普通队员显示所有功能
            // 所有登录用户都能看到积分排行榜和考勤记录
            document.querySelectorAll('.tab-btn').forEach(btn => {
                if (btn.dataset.tab === 'ranking' || btn.dataset.tab === 'records') {
                    btn.style.display = 'inline-block';
                }
            });
            
            // 普通队员能看到考勤打卡
            document.querySelector('[data-tab="checkin"]').style.display = 'inline-block';
        }
    }
}

// 考勤打卡处理
function handleCheckin(e) {
    e.preventDefault();
    
    const type = document.getElementById('checkinType').value;
    const date = document.getElementById('checkinDate').value;
    const screenshotData = checkinScreenshotData.value;
    const remark = document.getElementById('checkinRemark').value;
    
    // 验证
    if (!type || !date || !screenshotData) {
        alert('请填写完整的打卡信息，包括考勤类型、日期和上传截图！');
        return;
    }
    
    // 检查当天是否已打卡同一类型
    const today = date;
    const existingRecord = checkinRecords.find(record => 
        record.name === currentUser && record.type === type && record.date === today
    );
    
    if (existingRecord) {
        alert('今天已经打卡过该类型的考勤了！');
        return;
    }
    
    // 创建新记录
    const newRecord = {
        id: Date.now(),
        name: currentUser,
        team: currentTeam,
        type,
        date,
        screenshot: screenshotData,
        score: scoreConfig[type],
        reviewScore: 0, // 初始复核分数为0
        status: '已通过', // 默认为已通过，管理员可以修改
        approvedBy: currentUser,
        approvedTime: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0].substring(0, 5),
        remark
    };
    
    // 添加到记录
    checkinRecords.push(newRecord);
    saveData('checkinRecords', checkinRecords);
    
    // 重置表单
    checkinForm.reset();
    
    // 重置图片预览和隐藏字段
    preview.innerHTML = '';
    checkinScreenshotData.value = '';
    
    // 更新日期
    const now = new Date();
    const todayDate = now.toISOString().split('T')[0];
    document.getElementById('checkinDate').value = todayDate;
    
    // 显示成功信息
    alert('打卡成功！');
    
    // 更新排行榜和记录
    renderAll();
}





// 切换选项卡
function switchTab(tabName) {
    // 移除所有活动状态
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // 添加当前选项卡活动状态
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(tabName).classList.add('active');
    
    // 渲染对应内容
    if (tabName === 'ranking') {
        renderRanking();
    } else if (tabName === 'records') {
        renderRecords();
    } else if (tabName === 'admin') {
        renderAdminUI();
    }
}

// 渲染所有内容
function renderAll() {
    renderRanking();
    renderRecords();
}

// 渲染管理员界面
function renderAdminUI() {
    // 初始化队员选择下拉框
    const adjustNameSelect = document.getElementById('adjustName');
    const deleteMemberSelect = document.getElementById('deleteMemberName');
    
    // 清空现有选项
    adjustNameSelect.innerHTML = '<option value="">请选择队员</option>';
    deleteMemberSelect.innerHTML = '<option value="">请选择成员</option>';
    
    // 从teamMembers对象中获取所有队员，确保下拉栏包含所有队员
    const allTeamMembers = [...teamMembers["进阶队"], ...teamMembers["初阶队"]];
    
    // 去重并排序
    const uniqueMembers = [...new Set(allTeamMembers)].sort();
    
    // 添加所有成员到下拉框
    uniqueMembers.forEach(member => {
        // 添加到调整分数的下拉框
        const adjustOption = document.createElement('option');
        adjustOption.value = member;
        adjustOption.textContent = member;
        adjustNameSelect.appendChild(adjustOption);
        
        // 添加到删除成员的下拉框
        const deleteOption = document.createElement('option');
        deleteOption.value = member;
        deleteOption.textContent = member;
        deleteMemberSelect.appendChild(deleteOption);
    });
}

// 渲染积分排行榜
function renderRanking(type = 'total') {
    // 过滤本周记录
    let filteredRecords = checkinRecords;
    if (type === 'weekly') {
        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const startOfWeekString = startOfWeek.toISOString().split('T')[0];
        filteredRecords = checkinRecords.filter(record => record.date >= startOfWeekString);
    }
    
    // 计算进阶队积分
    const advancedScores = calculateTeamScores(filteredRecords, "进阶队");
    // 计算初阶队积分
    const beginnerScores = calculateTeamScores(filteredRecords, "初阶队");
    
    // 渲染表格
    rankingBody.innerHTML = '';
    
    // 渲染进阶队排行榜
    addTeamHeader("进阶队");
    renderTeamRanking(advancedScores);
    
    // 添加分隔线
    const separator = document.createElement('tr');
    separator.innerHTML = '<td colspan="8" style="text-align: center; padding: 10px; font-weight: bold; background-color: #f0f0f0;">------------------------</td>';
    rankingBody.appendChild(separator);
    
    // 渲染初阶队排行榜
    addTeamHeader("初阶队");
    renderTeamRanking(beginnerScores);
}

// 计算队伍积分
function calculateTeamScores(records, team) {
    const userScores = {};
    
    // 初始化用户积分对象
    teamMembers[team].forEach(member => {
        userScores[member] = {
            name: member,
            team: team,
            "代表参赛": 0,
            "岩馆集训": 0,
            "岩馆黑练": 0,
            "力量黑练": 0,
            reviewScore: 0,
            total: 0
        };
    });
    
    // 计算积分
    records.filter(record => record.team === team).forEach(record => {
        if (userScores[record.name]) {
            userScores[record.name][record.type] += record.score;
            userScores[record.name].reviewScore += record.reviewScore;
            userScores[record.name].total += record.score + record.reviewScore;
        }
    });
    
    // 转换为数组并排序
    return Object.values(userScores).sort((a, b) => b.total - a.total);
}

// 添加队伍标题
function addTeamHeader(teamName) {
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `<td colspan="8" style="text-align: center; padding: 10px; font-weight: bold; background-color: #e8f4f8;">${teamName}积分排行榜</td>`;
    rankingBody.appendChild(headerRow);
}

// 渲染单队排行榜
function renderTeamRanking(scores) {
    scores.forEach((user, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${user.name}</td>
            <td>${user["代表参赛"]}</td>
            <td>${user["岩馆集训"]}</td>
            <td>${user["岩馆黑练"]}</td>
            <td>${user["力量黑练"]}</td>
            <td>${user.reviewScore}</td>
            <td>${user.total}</td>
        `;
        rankingBody.appendChild(row);
    });
}

// 渲染考勤记录
function renderRecords() {
    const searchTerm = searchRecords.value.toLowerCase();
    const filter = filterType.value;
    
    // 筛选记录
    let filteredRecords = checkinRecords;
    
    // 管理员可以查看所有记录，队员只能查看自己队伍的记录
    if (userType === 'member') {
        filteredRecords = filteredRecords.filter(record => record.team === currentTeam);
    }
    
    // 搜索筛选
    if (searchTerm) {
        filteredRecords = filteredRecords.filter(record => 
            record.name.toLowerCase().includes(searchTerm) || 
            record.type.toLowerCase().includes(searchTerm)
        );
    }
    
    // 类型筛选
    if (filter) {
        filteredRecords = filteredRecords.filter(record => record.type === filter);
    }
    
    // 按日期降序排序
    filteredRecords.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // 渲染表格
    recordsBody.innerHTML = '';
    filteredRecords.forEach((record, index) => {
        const row = document.createElement('tr');
        
        // 状态标签
        let statusClass = '';
        switch (record.status) {
            case '已通过':
                statusClass = 'status-approved';
                break;
            case '待审核':
                statusClass = 'status-pending';
                break;
            case '已拒绝':
                statusClass = 'status-rejected';
                break;
        }
        
        // 操作按钮（仅管理员可见）
        let actionButtons = '';
        if (userType === 'admin') {
            actionButtons = `
                <td class="admin-only">
                    <button class="btn btn-small btn-success" onclick="approveRecord(${record.id})">通过</button>
                    <button class="btn btn-small btn-danger" onclick="rejectRecord(${record.id})">拒绝</button>
                </td>
            `;
        }
        
        // 队伍列（仅管理员可见）
        const teamColumn = userType === 'admin' ? `<td class="admin-only">${record.team}</td>` : '';
        
        // 图片链接或显示
        let screenshotDisplay = '';
        if (record.screenshot) {
            screenshotDisplay = `<a href="${record.screenshot}" class="video-link" target="_blank">查看截图</a>`;
        } else if (record.video) {
            // 兼容旧数据
            screenshotDisplay = `<a href="${record.video}" class="video-link" target="_blank">查看截图</a>`;
        } else {
            screenshotDisplay = '无截图';
        }
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${record.name}</td>
            ${teamColumn}
            <td>${record.type}</td>
            <td>${record.date}</td>
            <td>${screenshotDisplay}</td>
            <td>${record.score}</td>
            <td><span class="status-tag ${statusClass}">${record.status}</span></td>
            ${actionButtons}
        `;
        
        recordsBody.appendChild(row);
    });
}

// 筛选记录
function filterRecords() {
    renderRecords();
}

// 通过考勤记录
function approveRecord(recordId) {
    const record = checkinRecords.find(r => r.id === recordId);
    if (record) {
        record.status = '已通过';
        record.approvedBy = currentUser;
        record.approvedTime = new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0].substring(0, 5);
        saveData('checkinRecords', checkinRecords);
        renderRecords();
        renderRanking();
    }
}

// 拒绝考勤记录
function rejectRecord(recordId) {
    const record = checkinRecords.find(r => r.id === recordId);
    if (record) {
        record.status = '已拒绝';
        record.approvedBy = currentUser;
        record.approvedTime = new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0].substring(0, 5);
        saveData('checkinRecords', checkinRecords);
        renderRecords();
        renderRanking();
    }
}

// 管理员调整队员分数
function adjustMemberScore() {
    const memberName = document.getElementById('adjustName').value;
    const reviewScore = parseInt(document.getElementById('reviewScore').value);
    
    // 验证输入
    if (!memberName || isNaN(reviewScore)) {
        alert('请填写完整的调整信息！');
        return;
    }
    
    // 确认是否继续
    if (!confirm(`确定要为队员 ${memberName} 添加 ${reviewScore} 分的复核分数吗？`)) {
        return;
    }
    
    // 创建一个新的复核记录
    const newReviewRecord = {
        id: Date.now(),
        name: memberName,
        team: teamMembers["进阶队"].includes(memberName) ? "进阶队" : "初阶队",
        type: "管理员复核",
        date: new Date().toISOString().split('T')[0],
        screenshot: "",
        score: 0,
        reviewScore: reviewScore,
        status: '已通过',
        approvedBy: currentUser,
        approvedTime: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0].substring(0, 5),
        remark: "管理员复核调整分数"
    };
    
    // 添加到记录
    checkinRecords.push(newReviewRecord);
    saveData('checkinRecords', checkinRecords);
    
    alert('复核分数添加成功！');
    
    // 重置表单
    document.getElementById('reviewScore').value = '';
    
    // 更新排行榜和记录
    renderAll();
}

// 管理员添加成员
function addMember() {
    const newMemberName = document.getElementById('newMemberName').value;
    const newMemberTeam = document.getElementById('newMemberTeam').value;
    
    // 验证输入
    if (!newMemberName || !newMemberTeam) {
        alert('请填写完整的成员信息！');
        return;
    }
    
    // 检查成员是否已存在
    if (allMembers.includes(newMemberName)) {
        alert('该成员已存在！');
        return;
    }
    
    // 添加到所有成员列表
    allMembers.push(newMemberName);
    
    // 添加到对应的队伍
    teamMembers[newMemberTeam].push(newMemberName);
    
    // 保存数据
    saveData('allMembers', allMembers);
    saveData('teamMembers', teamMembers);
    
    alert('成员添加成功！');
    
    // 重置表单
    document.getElementById('newMemberName').value = '';
    document.getElementById('newMemberTeam').value = '';
    
    // 更新管理员界面
    renderAdminUI();
    
    // 更新登录页面的昵称下拉栏
    updateNicknameOptions();
}

// 管理员删除成员
function deleteMember() {
    const memberName = document.getElementById('deleteMemberName').value;
    
    // 验证输入
    if (!memberName) {
        alert('请选择要删除的成员！');
        return;
    }
    
    // 确认删除
    if (!confirm(`确定要删除成员 ${memberName} 吗？`)) {
        return;
    }
    
    // 从所有成员列表中删除
    allMembers = allMembers.filter(member => member !== memberName);
    
    // 从对应的队伍中删除
    for (const team in teamMembers) {
        teamMembers[team] = teamMembers[team].filter(member => member !== memberName);
    }
    
    // 保存数据
    saveData('allMembers', allMembers);
    saveData('teamMembers', teamMembers);
    
    alert('成员删除成功！');
    
    // 更新管理员界面
    renderAdminUI();
    
    // 更新登录页面的昵称下拉栏
    updateNicknameOptions();
}

// 初始化应用
init();