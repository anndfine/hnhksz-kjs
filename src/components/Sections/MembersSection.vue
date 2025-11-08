<template>
  <section id="members" class="py-5">
    <div class="container">
      <div class="row mb-5">
        <div class="col-lg-8 mx-auto text-center">
          <h2 class="display-4 fw-bold mb-3">成员风采</h2>
          <p class="lead text-muted">
            认识我们优秀的科技社成员，他们在各个技术领域展现才华。
          </p>
        </div>
      </div>

      <!-- 按届别分组显示成员 -->
      <div v-for="(group, groupName) in memberGroups" :key="groupName" class="row mb-5">
        <div class="col-12">
          <h4 class="text-center border-bottom pb-2 mb-4"
            :class="groupName === 'current' ? 'text-primary' : 'text-muted'">
            {{ group.title }}
          </h4>
        </div>

        <!-- 现任成员卡片布局 -->
        <template v-if="groupName === 'current'">
          <div v-for="(member, index) in group.members" :key="index" class="col-lg-3 col-md-4 col-6 mb-4">
            <div class="card border-0 shadow-sm h-100 text-center">
              <div class="card-body p-3">
                <div class="member-avatar mx-auto mb-3">
                  <div class="rounded-circle d-flex align-items-center justify-content-center text-white"
                    :class="member.avatarBgColor || 'bg-primary'" style="width: 80px; height: 80px;">
                    <img v-if="member.avatar" :src="member.avatar" :alt="member.name"
                      class="rounded-circle w-100 h-100 object-fit-cover" @error="handleAvatarError"
                      style="object-fit: cover;">
                    <i class="bi bi-person-fill display-6"></i>
                  </div>
                </div>
                <h6 class="fw-bold mb-1">{{ member.name }}</h6>
                <p v-if="member.position" class="text-muted small mb-2">{{ member.position }}</p>
                <p v-if="member.description" class="text-muted small mb-3">{{ member.description }}</p>
                <div v-if="member.skills && member.skills.length > 0" class="member-skills">
                  <span v-for="skill in member.skills" :key="skill" class="badge bg-light text-dark small">
                    {{ skill }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- 往届成员简洁布局 -->
        <template v-else>
          <div v-for="(member, index) in group.members" :key="index" class="col-lg-2 col-md-3 col-4 mb-3">
            <div class="text-center">
              <div class="member-avatar mx-auto mb-2">
                <div class="rounded-circle d-flex align-items-center justify-content-center text-white"
                  :class="member.avatarBgColor || 'bg-secondary'" style="width: 60px; height: 60px;">
                  <img v-if="member.avatar" :src="member.avatar" :alt="member.name"
                    class="rounded-circle w-100 h-100 object-fit-cover" @error="handleAvatarError"
                    style="object-fit: cover;">
                  <i class="bi bi-person-fill"></i>
                </div>
              </div>
              <h6 class="fw-bold mb-1 small">{{ member.name }}</h6>
              <p v-if="member.position" class="text-muted small mb-0">{{ member.position }}</p>
            </div>
          </div>
        </template>
      </div>

      <!-- 成员统计 -->
      <div class="row mt-5">
        <div class="col-12">
          <div class="bg-light rounded-4 p-4">
            <div class="row text-center">
              <div class="col-md-3 col-6 mb-3">
                <div class="h2 fw-bold text-primary">{{ currentMembersCount }}+</div>
                <div class="text-muted">现任成员</div>
              </div>
              <div class="col-md-3 col-6 mb-3">
                <div class="h2 fw-bold text-success">{{ uniqueSkillsCount }}</div>
                <div class="text-muted">技术方向</div>
              </div>
              <div class="col-md-3 col-6 mb-3">
                <div class="h2 fw-bold text-info">{{ alumniMembersCount }}+</div>
                <div class="text-muted">往届骨干</div>
              </div>
              <div class="col-md-3 col-6 mb-3">
                <div class="h2 fw-bold text-warning">8</div>
                <div class="text-muted">获奖成员</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 简化的成员数据接口 - 只有name是必须的，其他都是可选的
interface Member {
  name: string
  position?: string
  description?: string
  skills?: string[]
  avatar?: string
  avatarBgColor?: string
  graduationYear?: number  // 可选的毕业年份
}

// 简化的成员数据 - 去掉id和isCurrent字段
const members = ref<Member[]>([
  // 2027届现任成员
  {
    name: '薯片切条',
    position: '社长',
    description: '擅长摄影，正在向硬件编程方向学习',
    skills: ['摄影', 'Mind+'],
    avatar: 'https://cn1.anndfine.top/downloadfiles/lD7nac_S8EE',
    avatarBgColor: 'bg-primary',
    graduationYear: 2027
  },
  {
    name: '张燕婷',
    position: '副社长',
    description: '',
    skills: [],
    avatar: 'https://cn1.anndfine.top/downloadfiles/leCYzx_ONP4',
    avatarBgColor: 'bg-success',
    graduationYear: 2027
  },
  {
    name: '王芳',
    position: '项目组长',
    description: '热爱3D建模与创意设计',
    skills: ['3D建模', '设计'],
    avatar: 'https://example.com/avatars/wangfang.jpg',
    avatarBgColor: 'bg-secondary',
    graduationYear: 2027
  },
  // {
  //   name: '陈伟',
  //   position: '开发组长',
  //   description: '移动应用开发专家',
  //   skills: ['Flutter', 'App开发'],
  //   avatar: 'https://example.com/avatars/chenwei.jpg',
  //   avatarBgColor: 'bg-info',
  //   graduationYear: 2027
  // },
  // // 往届成员 - 有graduationYear的
  // {
  //   name: '刘强',
  //   position: '2023届社长',
  //   avatar: 'https://example.com/avatars/liuqiang.jpg',
  //   graduationYear: 2023
  // },
  // {
  //   name: '赵雪',
  //   position: '2023届副社长',
  //   avatar: 'https://example.com/avatars/zhaoxue.jpg',
  //   graduationYear: 2023
  // },
  // {
  //   name: '孙磊',
  //   position: '2022届社长',
  //   avatar: 'https://example.com/avatars/sunlei.jpg',
  //   graduationYear: 2022
  // },
  // {
  //   name: '周婷',
  //   position: '2022届技术总监',
  //   avatar: 'https://example.com/avatars/zhouting.jpg',
  //   graduationYear: 2022
  // },
  // {
  //   name: '吴刚',
  //   position: '2021届社长',
  //   avatar: 'https://example.com/avatars/wugang.jpg',
  //   graduationYear: 2021
  // },
  // {
  //   name: '郑小红',
  //   position: '2021届项目组长',
  //   avatar: 'https://example.com/avatars/zhengxiaohong.jpg',
  //   graduationYear: 2021
  // },
  // // 往届成员 - 没有graduationYear的（视为往届一组）
  // {
  //   name: '张明',
  //   position: '前技术总监'
  // },
  // {
  //   name: '刘芳',
  //   position: '前项目组长'
  // },
  // {
  //   name: '陈浩',
  //   position: '前开发组长'
  // },
  // {
  //   name: '杨洋',
  //   position: '前设计总监'
  // }
])

// 按届别分组 - 根据graduationYear智能分组
const memberGroups = computed(() => {
  // 有graduationYear的成员按年份分组
  const membersWithYear = members.value.filter(m => m.graduationYear)
  const membersWithoutYear = members.value.filter(m => !m.graduationYear)

  // 按毕业年份对成员进行分组
  const membersByYear = membersWithYear.reduce((groups, member) => {
    const year = member.graduationYear!
    if (!groups[year]) {
      groups[year] = []
    }
    groups[year].push(member)
    return groups
  }, {} as Record<number, Member[]>)

  // 构建分组对象
  const groups: Record<string, { title: string; members: Member[] }> = {}

  // 添加现任成员组（有graduationYear且年份较新的）
  const currentYear = new Date().getFullYear()
  const currentMembers = membersWithYear.filter(m =>
    m.graduationYear && m.graduationYear >= currentYear - 1
  )

  if (currentMembers.length > 0) {
    groups['current'] = {
      title: `${Math.max(...currentMembers.map(m => m.graduationYear!))}届骨干成员`,
      members: currentMembers
    }
  }

  // 添加往届分组（按年份倒序排列）
  Object.keys(membersByYear)
    .sort((a, b) => Number(b) - Number(a))
    .forEach(year => {
      const yearNum = Number(year)
      // 跳过已经归为现任的年份
      if (!currentMembers.some(m => m.graduationYear === yearNum)) {
        groups[`alumni_${year}`] = {
          title: `${year}届骨干成员`,
          members: membersByYear[yearNum]!
        }
      }
    })

  // 添加没有graduationYear的往届成员组
  if (membersWithoutYear.length > 0) {
    groups['alumni_unknown'] = {
      title: '往届骨干成员',
      members: membersWithoutYear
    }
  }

  return groups
})

// 统计信息
const currentMembersCount = computed(() => {
  const currentYear = new Date().getFullYear()
  return members.value.filter(m =>
    m.graduationYear && m.graduationYear >= currentYear - 1
  ).length
})

const alumniMembersCount = computed(() =>
  members.value.filter(m => !m.graduationYear ||
    m.graduationYear < new Date().getFullYear() - 1
  ).length
)

const uniqueSkillsCount = computed(() => {
  const allSkills = members.value.flatMap(m => m.skills || [])
  return new Set(allSkills).size
})

// 头像加载失败处理
const handleAvatarError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.display = 'none'
  // 默认的bi bi-person-fill图标会显示在img下层
}
</script>

<style scoped>
.member-avatar {
  transition: transform 0.3s ease;
  position: relative;
}

.card:hover .member-avatar {
  transform: scale(1.1);
}

.member-skills .badge {
  font-size: 0.7rem;
  margin: 0.1rem;
}

/* 头像容器样式 */
.member-avatar>div {
  position: relative;
}

.member-avatar img {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.member-avatar i {
  position: relative;
  z-index: 0;
}

/* 头像加载失败时隐藏图片 */
.member-avatar img:not([src]),
.member-avatar img[src=""],
.member-avatar img[style*="display: none"] {
  display: none;
}
</style>