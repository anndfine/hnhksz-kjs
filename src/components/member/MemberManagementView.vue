<!-- src/components/member/MemberManagementView.vue -->
<template>
    <div class="member-management-view">
        <!-- 统计卡片 -->
        <div class="row mb-4">
            <div class="col  mb-3">
                <div class="card stat-card border-0 shadow-sm">
                    <div class="card-body">
                        <div class="d-flex align-items-center">
                            <div class="stat-icon bg-primary text-white rounded-circle me-3">
                                <i class="bi bi-people"></i>
                            </div>
                            <div>
                                <h4 class="stat-value mb-0">{{ stats.totalMembers }}</h4>
                                <p class="stat-label text-muted mb-0">成员总数</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-3 d-none">
                <div class="card stat-card border-0 shadow-sm">
                    <div class="card-body">
                        <div class="d-flex align-items-center">
                            <div class="stat-icon bg-success text-white rounded-circle me-3">
                                <i class="bi bi-check-circle"></i>
                            </div>
                            <div>
                                <h4 class="stat-value mb-0">{{ stats.activeMembers }}</h4>
                                <p class="stat-label text-muted mb-0">活跃成员</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col mb-3">
                <div class="card stat-card border-0 shadow-sm">
                    <div class="card-body">
                        <div class="d-flex align-items-center">
                            <div class="stat-icon bg-warning text-white rounded-circle me-3">
                                <i class="bi bi-person-plus"></i>
                            </div>
                            <div>
                                <h4 class="stat-value mb-0">{{ stats.newMembers }}</h4>
                                <p class="stat-label text-muted mb-0">本月新增</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-xl-3 col-md-6 mb-3 d-none">
                <div class="card stat-card border-0 shadow-sm">
                    <div class="card-body">
                        <div class="d-flex align-items-center">
                            <div class="stat-icon bg-info text-white rounded-circle me-3">
                                <i class="bi bi-clock-history"></i>
                            </div>
                            <div>
                                <h4 class="stat-value mb-0">{{ stats.avgAttendance }}%</h4>
                                <p class="stat-label text-muted mb-0">平均出勤率</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 搜索和操作栏 -->
        <div class="card border-0 shadow-sm mb-4">
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col-md-6 mb-3 mb-md-0">
                        <div class="input-group">
                            <span class="input-group-text">
                                <i class="bi bi-search"></i>
                            </span>
                            <input type="text" class="form-control" placeholder="搜索成员姓名、学号或部门..." v-model="searchQuery"
                                @input="handleSearch">
                        </div>
                    </div>
                    <div class="col-md-6 d-flex justify-content-md-end">
                        <button class="btn btn-primary me-2" @click="showAddMemberModal">
                            <i class="bi bi-person-plus me-1"></i>添加成员
                        </button>
                        <button class="btn btn-outline-secondary" @click="refreshData">
                            <i class="bi bi-arrow-clockwise"></i>
                        </button>
                    </div>
                </div>

                <!-- 筛选条件 -->
                <div class="row mt-3">
                    <div class="col-md-4 mb-2">
                        <select class="form-select" v-model="filterDepartment" @change="applyFilters">
                            <option value="">所有部门</option>
                            <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
                        </select>
                    </div>
                    <div class="col-md-4 mb-2">
                        <select class="form-select" v-model="filterRole" @change="applyFilters">
                            <option value="">所有角色</option>
                            <option value="admin">管理员</option>
                            <option value="member">普通成员</option>
                            <option value="intern">实习生</option>
                        </select>
                    </div>
                    <div class="col-md-4 mb-2">
                        <select class="form-select" v-model="filterStatus" @change="applyFilters">
                            <option value="">所有状态</option>
                            <option value="active">活跃</option>
                            <option value="inactive">不活跃</option>
                            <option value="graduated">已毕业</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <!-- 成员列表 -->
            <div class="col-lg-9 col-xl-8">
                <div class="card border-0 shadow-sm mb-4">
                    <div
                        class="card-header bg-transparent border-0 pb-0 d-flex justify-content-between align-items-center">
                        <h5 class="card-title mb-0">
                            <i class="bi bi-list-columns text-primary me-2"></i>
                            成员列表
                        </h5>
                        <span class="badge bg-primary">{{ filteredMembers.length }} 人</span>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-hover mb-0">
                                <thead>
                                    <tr class="table-light">
                                        <th width="60" class="ps-4">
                                            <input type="checkbox" class="form-check-input" v-model="selectAll"
                                                @change="toggleSelectAll">
                                        </th>
                                        <th>成员信息</th>
                                        <th>部门</th>
                                        <th>角色</th>
                                        <th>状态</th>
                                        <th class="d-none d-lg-table-cell">加入时间</th>
                                        <th width="120" class="text-end pe-4">操作</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="member in paginatedMembers" :key="member.id"
                                        :class="{ 'table-active': selectedMembers.includes(member.id) }">
                                        <td class="ps-4">
                                            <input type="checkbox" class="form-check-input"
                                                :checked="selectedMembers.includes(member.id)"
                                                @change="toggleMemberSelection(member.id)">
                                        </td>
                                        <td>
                                            <div class="d-flex align-items-center">
                                                <div class="avatar me-3 d-none d-xl-flex ">
                                                    <div class="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center"
                                                        style="width: 40px; height: 40px;">
                                                        {{ member.name.charAt(0) }}
                                                    </div>
                                                </div>
                                                <div>
                                                    <h6 class="mb-0">{{ member.name }}</h6>
                                                    <small class="text-muted">{{ member.studentId }}</small>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span class="badge bg-info-subtle text-info">{{ member.department }}</span>
                                        </td>
                                        <td>
                                            <span class="badge" :class="getRoleBadgeClass(member.role)">
                                                {{ member.role }}
                                            </span>
                                        </td>
                                        <td>
                                            <span class="badge" :class="getStatusBadgeClass(member.status)">
                                                <i :class="getStatusIcon(member.status) + ' me-1'"></i><span
                                                    class="d-sm-none d-lg-inline">
                                                    {{ statusTextMap[member.status as keyof typeof statusTextMap] ||
                                                        member.status }}</span>
                                            </span>
                                        </td>
                                        <td class="d-none d-lg-table-cell">
                                            <small class="text-muted">{{ formatDate(member.joinDate) }}</small>
                                        </td>
                                        <td class="text-end pe-4">
                                            <div class="btn-group btn-group-sm">
                                                <button class="btn btn-outline-primary"
                                                    @click="viewMemberDetail(member.id)" title="查看详情">
                                                    <i class="bi bi-eye"></i>
                                                </button>
                                                <button class="btn btn-outline-success" @click="editMember(member.id)"
                                                    title="编辑">
                                                    <i class="bi bi-pencil"></i>
                                                </button>
                                                <button class="btn btn-outline-danger" @click="deleteMember(member.id)"
                                                    title="删除">
                                                    <i class="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <!-- 空状态 -->
                        <div v-if="filteredMembers.length === 0" class="text-center py-5">
                            <i class="bi bi-people display-4 text-muted mb-3"></i>
                            <p class="text-muted">暂无成员数据</p>
                            <button class="btn btn-primary" @click="showAddMemberModal">
                                <i class="bi bi-person-plus me-1"></i>添加第一个成员
                            </button>
                        </div>
                    </div>

                    <!-- 分页 -->
                    <div v-if="filteredMembers.length > 0" class="card-footer bg-transparent border-0">
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="text-muted">
                                显示 {{ (currentPage - 1) * pageSize + 1 }}-{{ Math.min(currentPage * pageSize,
                                    filteredMembers.length) }} 条，共 {{ filteredMembers.length }} 条
                            </div>
                            <nav>
                                <ul class="pagination mb-0">
                                    <li class="page-item" :class="{ disabled: currentPage === 1 }">
                                        <button class="page-link" @click="changePage(currentPage - 1)">
                                            上一页
                                        </button>
                                    </li>
                                    <li v-for="page in totalPages" :key="page" class="page-item"
                                        :class="{ active: currentPage === page }">
                                        <button class="page-link" @click="changePage(page)">{{ page }}</button>
                                    </li>
                                    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                                        <button class="page-link" @click="changePage(currentPage + 1)">
                                            下一页
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>

                <!-- 批量操作 -->
                <div v-if="selectedMembers.length > 0" class="card border-0 shadow-sm mb-4">
                    <div class="card-body">
                        <div class="d-flex align-items-center justify-content-between">
                            <div>
                                <span class="text-muted me-3">已选择 {{ selectedMembers.length }} 个成员</span>
                            </div>
                            <div class="btn-group">
                                <button class="btn btn-outline-success" @click="batchUpdateStatus('active')">
                                    <i class="bi bi-check-circle me-1"></i>设为活跃
                                </button>
                                <button class="btn btn-outline-warning" @click="batchUpdateStatus('inactive')">
                                    <i class="bi bi-pause-circle me-1"></i>设为不活跃
                                </button>
                                <button class="btn btn-outline-danger" @click="batchDeleteMembers">
                                    <i class="bi bi-trash me-1"></i>批量删除
                                </button>
                                <button class="btn btn-outline-secondary" @click="clearSelection">
                                    <i class="bi bi-x-circle me-1"></i>取消选择
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 右侧内容 -->
            <div class="col-lg-3 col-xl-4">
                <!-- 快速操作 -->
                <div class="card border-0 shadow-sm mb-4 d-none">
                    <div class="card-header bg-transparent border-0 pb-0">
                        <h5 class="card-title mb-0">
                            <i class="bi bi-lightning text-success me-2"></i>
                            快速操作
                        </h5>
                    </div>
                    <div class="card-body">
                        <div class="quick-actions">
                            <div class="row g-2">
                                <div class="col-6" v-for="action in quickActions" :key="action.id">
                                    <button class="btn btn-outline-primary w-100 h-100 py-3"
                                        @click="handleQuickAction(action.id)">
                                        <i :class="[action.icon, 'mb-2 d-block']"></i>
                                        <small>{{ action.name }}</small>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 部门分布 -->
                <div class="card border-0 shadow-sm mb-4">
                    <div class="card-header bg-transparent border-0 pb-0">
                        <h5 class="card-title mb-0">
                            <i class="bi bi-pie-chart text-info me-2"></i>
                            部门分布
                        </h5>
                    </div>
                    <div class="card-body">
                        <div class="department-distribution">
                            <div v-for="dept in departmentStats" :key="dept.name"
                                class="department-item d-flex align-items-center justify-content-between py-2 border-bottom">
                                <div class="department-info d-flex align-items-center">
                                    <div class="dept-color me-3 d-none d-xl-inline"
                                        :style="{ backgroundColor: dept.color }"></div>
                                    <div>
                                        <h6 class="mb-0">{{ dept.name }}</h6>
                                        <small class="text-muted">{{ dept.count }} 人</small>
                                    </div>
                                </div>
                                <div class="department-percentage">
                                    <span class="text-muted">{{ dept.percentage }}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 最近活跃成员 -->
                <div class="card border-0 shadow-sm">
                    <div class="card-header bg-transparent border-0 pb-0">
                        <h5 class="card-title mb-0">
                            <i class="bi bi-clock-history text-warning me-2"></i>
                            最近活跃
                        </h5>
                    </div>
                    <div class="card-body">
                        <div class="recent-active-list">
                            <div v-for="member in recentActiveMembers" :key="member.id"
                                class="active-member-item d-flex align-items-center py-2 border-bottom">
                                <div class="avatar me-3">
                                    <div class="d-none d-xl-flex bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center"
                                        style="width: 36px; height: 36px;">
                                        {{ member.name.charAt(0) }}
                                    </div>
                                </div>
                                <div class="flex-grow-1">
                                    <h6 class="mb-0">{{ member.name }}</h6>
                                    <small class="text-muted">{{ member.lastActivity }}</small>
                                </div>
                                <span class="badge bg-success">
                                    <i class="bi bi-check-circle me-1"></i><span class="d-none d-xl-inline">在线</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 添加成员模态框 -->
        <div v-if="showAddModal" class="modal fade show" style="display: block; background: rgba(0,0,0,0.5);">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="bi bi-person-plus me-2"></i>{{ editingMember ? '编辑成员' : '添加新成员' }}
                        </h5>
                        <button type="button" class="btn-close" @click="closeModal"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="saveMember">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">姓名 *</label>
                                    <input type="text" class="form-control" v-model="memberForm.name" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">学号 *</label>
                                    <input type="text" class="form-control" v-model="memberForm.studentId" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">部门 *</label>
                                    <select class="form-select" v-model="memberForm.department" required>
                                        <option value="">请选择部门</option>
                                        <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}
                                        </option>
                                    </select>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">角色 *</label>
                                    <select class="form-select" v-model="memberForm.role" required>
                                        <option value="">请选择角色</option>
                                        <option value="admin">管理员</option>
                                        <option value="member">普通成员</option>
                                        <option value="intern">实习生</option>
                                    </select>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">邮箱</label>
                                    <input type="email" class="form-control" v-model="memberForm.email">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">电话</label>
                                    <input type="tel" class="form-control" v-model="memberForm.phone">
                                </div>
                                <div class="col-md-12 mb-3">
                                    <label class="form-label">备注</label>
                                    <textarea class="form-control" rows="3" v-model="memberForm.notes"></textarea>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="closeModal">取消</button>
                        <button type="button" class="btn btn-primary" @click="saveMember">
                            {{ editingMember ? '更新' : '添加' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import toast, { showToast } from '@/utils/toast'
import { apinodes } from '@/data/apinodes'
// 成员接口
interface Member {
    id: number
    name: string
    studentId: string
    department: string
    role: string
    status: string
    email?: string
    phone?: string
    joinDate: string
    lastActivity: string
    notes?: string
    attendanceRate: number
}

// 统计数据
const stats = ref({
    totalMembers: 0,
    activeMembers: 0,
    newMembers: 0,
    avgAttendance: 0
})

const statusTextMap = {
    'active': '活跃',
    'inactive': '不活跃',
    'graduated': '已毕业'
}

// 成员数据
let members = ref<Member[]>([
    {
        id: 1,
        name: '张三',
        studentId: '20230001',
        department: '技术部',
        role: 'admin',
        status: 'active',
        email: 'zhangsan@example.com',
        phone: '13800138000',
        joinDate: '2023-09-01',
        lastActivity: '刚刚',
        attendanceRate: 95
    },
    {
        id: 2,
        name: '李四',
        studentId: '20230002',
        department: '宣传部',
        role: 'member',
        status: 'active',
        joinDate: '2023-09-10',
        lastActivity: '10分钟前',
        attendanceRate: 88
    },
    {
        id: 3,
        name: '王五',
        studentId: '20230003',
        department: '策划部',
        role: 'member',
        status: 'inactive',
        joinDate: '2023-09-15',
        lastActivity: '2天前',
        attendanceRate: 60
    },
    {
        id: 4,
        name: '赵六',
        studentId: '20230004',
        department: '技术部',
        role: 'intern',
        status: 'active',
        joinDate: '2023-10-01',
        lastActivity: '1小时前',
        attendanceRate: 92
    },
    {
        id: 5,
        name: '钱七',
        studentId: '20230005',
        department: '外联部',
        role: 'member',
        status: 'graduated',
        joinDate: '2022-09-01',
        lastActivity: '1个月前',
        attendanceRate: 78
    },
    {
        id: 6,
        name: '孙八',
        studentId: '20230006',
        department: '技术部',
        role: 'member',
        status: 'active',
        joinDate: '2023-09-20',
        lastActivity: '30分钟前',
        attendanceRate: 90
    },
    {
        id: 7,
        name: '周九',
        studentId: '20230007',
        department: '宣传部',
        role: 'member',
        status: 'active',
        joinDate: '2023-10-05',
        lastActivity: '2小时前',
        attendanceRate: 85
    },
    {
        id: 8,
        name: '吴十',
        studentId: '20230008',
        department: '策划部',
        role: 'intern',
        status: 'inactive',
        joinDate: '2023-10-10',
        lastActivity: '3天前',
        attendanceRate: 55
    }
])

// 部门列表
const departments = ref(['技术部', '宣传部', '策划部', '外联部', '组织部', '财务部'])

// 搜索和筛选
const searchQuery = ref('')
const filterDepartment = ref('')
const filterRole = ref('')
const filterStatus = ref('')

// 分页
const currentPage = ref(1)
const pageSize = 5

// 选择状态
const selectedMembers = ref<number[]>([])
const selectAll = ref(false)

// 模态框状态
const showAddModal = ref(false)
const editingMember = ref<Member | null>(null)

// 表单数据
const memberForm = ref({
    name: '',
    studentId: '',
    department: '',
    role: '',
    email: '',
    phone: '',
    notes: ''
})

// 快速操作
const quickActions = ref([
    { id: 'export', name: '导出数据', icon: 'bi bi-download' },
    { id: 'import', name: '导入成员', icon: 'bi bi-upload' },
    { id: 'assign', name: '分配任务', icon: 'bi bi-check-square' },
    { id: 'send', name: '发送通知', icon: 'bi bi-send' }
])

// 计算属性
const filteredMembers = computed(() => {
    return members.value.filter(member => {
        // 搜索过滤
        const searchMatch = !searchQuery.value ||
            member.name.includes(searchQuery.value) ||
            member.studentId.includes(searchQuery.value) ||
            member.department.includes(searchQuery.value)

        // 部门过滤
        const deptMatch = !filterDepartment.value || member.department === filterDepartment.value

        // 角色过滤
        const roleMatch = !filterRole.value || member.role === filterRole.value

        // 状态过滤
        const statusMatch = !filterStatus.value || member.status === filterStatus.value

        return searchMatch && deptMatch && roleMatch && statusMatch
    })
})

const paginatedMembers = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    const end = start + pageSize
    return filteredMembers.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredMembers.value.length / pageSize))

// 部门统计
const departmentStats = computed(() => {
    const deptCount: Record<string, number> = {}
    members.value.forEach(member => {
        deptCount[member.department] = (deptCount[member.department] || 0) + 1
    })

    const total = members.value.length
    const colors = ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#858796']

    return Object.entries(deptCount)
        .map(([name, count], index) => ({
            name,
            count,
            percentage: ((count / total) * 100).toFixed(1),
            color: colors[index % colors.length]
        }))
        .sort((a, b) => b.count - a.count)
})

// 最近活跃成员
const recentActiveMembers = computed(() => {
    return members.value
        .filter(m => m.status === 'active')
        .sort((a, b) => {
            // 简单的排序逻辑，实际项目中可能需要更复杂的逻辑
            const timeA = a.lastActivity.includes('刚刚') ? 0 :
                a.lastActivity.includes('分钟') ? 1 :
                    a.lastActivity.includes('小时') ? 2 : 3
            const timeB = b.lastActivity.includes('刚刚') ? 0 :
                b.lastActivity.includes('分钟') ? 1 :
                    b.lastActivity.includes('小时') ? 2 : 3
            return timeA - timeB
        })
        .slice(0, 5)
})

// 生命周期
onMounted(() => {
    calculateStats()
    showToast('info', '成员管理页面已加载')
})

// 方法

// 假设 apinodes 和 showToast 已提前定义
async function fetchAllMembers() {
    try {
        const fetchresult = await fetch(`${apinodes[0]!.domain}/api/admin/member/list/all`, {
            credentials: 'include',
            method: "POST"
        });

        // 1. 校验 HTTP 响应状态
        if (!fetchresult.ok) {
            throw new Error(`请求失败，状态码：${fetchresult.status}（${fetchresult.statusText}）`);
        }

        // 2. 解析响应体（根据接口返回格式选择 json() 或 text()，此处以 json 为例）
        const memberData = await fetchresult.json();
        return memberData; // 解析成功后返回数据，供后续业务使用

    } catch (error) {
        // 3. 安全处理 catch 块中的 error，明确类型判断
        let errorMessage = "获取成员列表失败，请稍后重试"; // 默认兜底提示

        // 优先判断是否为 Error 实例，提取精准错误信息
        if (error instanceof Error) {
            errorMessage = error.message; // 使用 Error 实例的 message 属性，更简洁友好
        }
        // 兼容其他可能的异常类型（字符串、数字等）
        else if (typeof error === "string") {
            errorMessage = error;
        }

        // 4. 调用提示函数，传递明确的错误信息
        showToast("error", errorMessage);
    }
}

const calculateStats = () => {
    fetchAllMembers();
    const total = members.value.length
    const active = members.value.filter(m => m.status === 'active').length
    const thisMonth = new Date().getMonth()
    const newCount = members.value.filter(m => {
        const joinMonth = new Date(m.joinDate).getMonth()
        return joinMonth === thisMonth
    }).length
    const avgAttendance = members.value.reduce((sum, m) => sum + m.attendanceRate, 0) / total

    stats.value = {
        totalMembers: total,
        activeMembers: active,
        newMembers: newCount,
        avgAttendance: Math.round(avgAttendance)
    }
}

const handleSearch = () => {
    currentPage.value = 1
}

const applyFilters = () => {
    currentPage.value = 1
}

const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
    }
}

const toggleMemberSelection = (memberId: number) => {
    const index = selectedMembers.value.indexOf(memberId)
    if (index === -1) {
        selectedMembers.value.push(memberId)
    } else {
        selectedMembers.value.splice(index, 1)
    }
    updateSelectAllState()
}

const toggleSelectAll = () => {
    if (selectAll.value) {
        selectedMembers.value = paginatedMembers.value.map(m => m.id)
    } else {
        selectedMembers.value = []
    }
}

const updateSelectAllState = () => {
    const pageIds = paginatedMembers.value.map(m => m.id)
    selectAll.value = pageIds.length > 0 &&
        pageIds.every(id => selectedMembers.value.includes(id))
}

const clearSelection = () => {
    selectedMembers.value = []
    selectAll.value = false
}

const showAddMemberModal = () => {
    memberForm.value = {
        name: '',
        studentId: '',
        department: '',
        role: '',
        email: '',
        phone: '',
        notes: ''
    }
    editingMember.value = null
    showAddModal.value = true
}

const editMember = (memberId: number) => {
    const member = members.value.find(m => m.id === memberId)
    if (member) {
        editingMember.value = member
        memberForm.value = {
            name: member.name,
            studentId: member.studentId,
            department: member.department,
            role: member.role,
            email: member.email || '',
            phone: member.phone || '',
            notes: member.notes || ''
        }
        showAddModal.value = true
    }
}

const saveMember = () => {
    if (editingMember.value) {
        // 更新成员
        const index = members.value.findIndex(m => m.id === editingMember.value!.id)
        if (index !== -1) {
            members.value[index] = {
                ...editingMember.value,
                ...memberForm.value
            }
            showToast('success', '成员信息更新成功')
        }
    } else {
        // 添加新成员
        const newMember: Member = {
            id: Math.max(...members.value.map(m => m.id)) + 1,
            name: memberForm.value.name,
            studentId: memberForm.value.studentId,
            department: memberForm.value.department,
            role: memberForm.value.role,
            status: 'active',
            email: memberForm.value.email || undefined,
            phone: memberForm.value.phone || undefined,
            joinDate: new Date().toISOString().split('T')[0] || "计算失败",
            lastActivity: '刚刚',
            notes: memberForm.value.notes || undefined,
            attendanceRate: 100
        }
        members.value.unshift(newMember)
        showToast('success', '成员添加成功')
    }

    calculateStats()
    closeModal()
}

const deleteMember = (memberId: number) => {
    if (confirm('确定要删除该成员吗？')) {
        const index = members.value.findIndex(m => m.id === memberId)
        if (index !== -1) {
            members.value.splice(index, 1)
            calculateStats()
            showToast('success', '成员删除成功')

            // 从选中列表中移除
            const selectedIndex = selectedMembers.value.indexOf(memberId)
            if (selectedIndex !== -1) {
                selectedMembers.value.splice(selectedIndex, 1)
            }
        }
    }
}

const batchDeleteMembers = () => {
    if (selectedMembers.value.length === 0) {
        showToast('warning', '请先选择成员')
        return
    }

    if (confirm(`确定要删除选中的 ${selectedMembers.value.length} 个成员吗？`)) {
        members.value = members.value.filter(m => !selectedMembers.value.includes(m.id))
        calculateStats()
        clearSelection()
        showToast('success', '批量删除成功')
    }
}

const batchUpdateStatus = (status: string) => {
    if (selectedMembers.value.length === 0) {
        showToast('warning', '请先选择成员')
        return
    }

    members.value.forEach(member => {
        if (selectedMembers.value.includes(member.id)) {
            member.status = status
        }
    })

    calculateStats()
    showToast('success', '状态更新成功')
}

const viewMemberDetail = (memberId: number) => {
    showToast('info', '查看成员详情功能开发中...')
}

const closeModal = () => {
    showAddModal.value = false
    editingMember.value = null
}

const refreshData = () => {
    calculateStats()
    showToast('success', '数据已刷新')
}

const handleQuickAction = (actionId: string) => {
    switch (actionId) {
        case 'export':
            showToast('info', '导出功能开发中...')
            break
        case 'import':
            showToast('info', '导入功能开发中...')
            break
        case 'assign':
            showToast('info', '分配任务功能开发中...')
            break
        case 'send':
            showToast('info', '发送通知功能开发中...')
            break
    }
}

// 辅助方法
const getRoleBadgeClass = (role: string) => {
    switch (role) {
        case 'admin': return 'bg-danger'
        case 'member': return 'bg-primary'
        case 'intern': return 'bg-success'
        default: return 'bg-secondary'
    }
}

const getStatusBadgeClass = (status: string) => {
    switch (status) {
        case 'active': return 'bg-success'
        case 'inactive': return 'bg-warning'
        case 'graduated': return 'bg-secondary'
        default: return 'bg-secondary'
    }
}

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'active': return 'bi bi-check-circle'
        case 'inactive': return 'bi bi-pause-circle'
        case 'graduated': return 'bi bi-mortarboard'
        default: return 'bi bi-question-circle'
    }
}

const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
}

members = ref<Member[]>([
    {
        id: 1,
        name: '三张',
        studentId: '20230001',
        department: '技术部',
        role: 'admin',
        status: 'active',
        email: 'zhangsan@example.com',
        joinDate: '2023-09-01',
        lastActivity: '刚刚',
        attendanceRate: 95
    },
    {
        id: 2,
        name: '李四',
        studentId: '20230002',
        department: '宣传部',
        role: 'member',
        status: 'active',
        joinDate: '2023-09-10',
        lastActivity: '10分钟前',
        attendanceRate: 88
    },
    {
        id: 3,
        name: '王五',
        studentId: '20230003',
        department: '策划部',
        role: 'member',
        status: 'inactive',
        joinDate: '2023-09-15',
        lastActivity: '2天前',
        attendanceRate: 60
    },
    {
        id: 4,
        name: '赵六',
        studentId: '20230004',
        department: '技术部',
        role: 'intern',
        status: 'active',
        joinDate: '2023-10-01',
        lastActivity: '1小时前',
        attendanceRate: 92
    },
    {
        id: 5,
        name: '钱七',
        studentId: '20230005',
        department: '外联部',
        role: 'member',
        status: 'graduated',
        joinDate: '2022-09-01',
        lastActivity: '1个月前',
        attendanceRate: 78
    },
    {
        id: 6,
        name: '孙八',
        studentId: '20230006',
        department: '技术部',
        role: 'member',
        status: 'active',
        joinDate: '2023-09-20',
        lastActivity: '30分钟前',
        attendanceRate: 90
    },
    {
        id: 7,
        name: '周九',
        studentId: '20230007',
        department: '宣传部',
        role: 'member',
        status: 'active',
        joinDate: '2023-10-05',
        lastActivity: '2小时前',
        attendanceRate: 85
    },
    {
        id: 8,
        name: '吴十',
        studentId: '20230008',
        department: '策划部',
        role: 'intern',
        status: 'inactive',
        joinDate: '2023-10-10',
        lastActivity: '3天前',
        attendanceRate: 55
    }
])
</script>

<style scoped>
.member-management-view {
    padding: 0;
}

.stat-card {
    transition: transform 0.3s ease;
}

.stat-card:hover {
    transform: translateY(-2px);
}

.stat-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
}

.stat-value {
    font-size: 1.75rem;
    font-weight: 700;
    color: #1e3c72;
}

.stat-label {
    font-size: 0.875rem;
}

.table th {
    font-weight: 600;
    border-bottom: 2px solid #dee2e6;
}

.table-hover tbody tr:hover {
    background-color: rgba(0, 0, 0, 0.04);
}

.quick-actions .btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 80px;
}

.dept-color {
    width: 16px;
    height: 16px;
    border-radius: 4px;
}

.department-item:hover,
.active-member-item:hover {
    background-color: #f8f9fa;
    border-radius: 4px;
}

.card {
    border-radius: 12px;
}

.card-header {
    padding: 20px 20px 0;
}

.card-body {
    padding: 20px;
}

.modal {
    background: rgba(0, 0, 0, 0.5);
}

.modal-content {
    border-radius: 12px;
    border: none;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.btn-group-sm .btn {
    padding: 0.25rem 0.5rem;
}

.avatar {
    display: flex;
    align-items: center;
    justify-content: center;
}

.avatar div {
    font-weight: 600;
    font-size: 1rem;
}
</style>