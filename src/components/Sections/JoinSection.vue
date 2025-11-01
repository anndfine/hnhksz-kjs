<!-- src/components/Sections/JoinSection.vue -->
<template>
  <section id="join" class="py-5 bg-primary text-white">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-lg-6">
          <h2 class="display-4 fw-bold mb-4">加入科技社</h2>
          <p class="lead mb-4">
            无论你是技术大神还是零基础小白，只要对科技充满热情，我们都欢迎你的加入！
          </p>

          <div class="join-benefits mb-5">
            <div class="benefit-item d-flex align-items-center mb-3">
              <i class="bi bi-check-circle-fill text-warning me-3 fs-4"></i>
              <span>专业的指导老师和技术支持</span>
            </div>
            <div class="benefit-item d-flex align-items-center mb-3">
              <i class="bi bi-check-circle-fill text-warning me-3 fs-4"></i>
              <span>丰富的项目实践机会</span>
            </div>
            <div class="benefit-item d-flex align-items-center mb-3">
              <i class="bi bi-check-circle-fill text-warning me-3 fs-4"></i>
              <span>参加各类科技竞赛</span>
            </div>
            <div class="benefit-item d-flex align-items-center mb-3">
              <i class="bi bi-check-circle-fill text-warning me-3 fs-4"></i>
              <span>与志同道合的伙伴共同成长</span>
            </div>
          </div>

          <div class="join-requirements mb-5">
            <h5 class="fw-bold mb-3">加入要求</h5>
            <ul class="list-unstyled">
              <li class="mb-2">• 海口四中在校学生</li>
              <li class="mb-2">• 对科技有浓厚兴趣</li>
              <li class="mb-2">• 愿意学习新知识</li>
              <li class="mb-2">• 有团队合作精神</li>
            </ul>
          </div>
        </div>

        <div class="col-lg-6">
          <div class="join-form bg-white rounded-4 p-4 text-dark">
            <h4 class="fw-bold mb-4 text-center">立即报名</h4>
            <form>
              <div class="row g-3">
                <div class="col-md-6">
                  <label for="name" class="form-label">姓名</label>
                  <input type="text" class="form-control" id="name" placeholder="请输入姓名">
                </div>
                <div class="col-md-6">
                  <label for="class" class="form-label">班级</label>
                  <input type="text" class="form-control" id="class" placeholder="例如：高一(1)班">
                </div>
                <div class="col-12">
                  <label for="contact" class="form-label">联系方式</label>
                  <input type="text" class="form-control" id="contact" placeholder="QQ/微信/电话">
                </div>
                <div class="col-12">
                  <label for="interest" class="form-label">感兴趣的方向</label>
                  <select class="form-select" id="interest">
                    <option selected>请选择感兴趣的方向</option>
                    <option value="programming">编程开发</option>
                    <option value="robot">机器人制作</option>
                    <option value="3d">3D打印与建模</option>
                    <option value="electronics">电子制作</option>
                    <option value="other">其他</option>
                  </select>
                </div>
                <div class="col-12">
                  <label for="experience" class="form-label">相关经验（选填）</label>
                  <textarea class="form-control" id="experience" rows="3" placeholder="请简要描述你的相关经验或技能"></textarea>
                </div>
                <div class="col-12">
                  <button type="submit" class="btn btn-primary w-100 py-2 fw-bold disabled" disabled>
                    <i class="bi bi-send me-2"></i>提交申请<small class="text-danger">(网站报名渠道暂不可用)</small>
                  </button>
                </div>
              </div>
            </form>
            <hr>
            <div class="mt-4 text-center">
              <p class="text-muted small mb-2">或通过以下方式联系我们</p>
              <div class="d-flex justify-content-center gap-3">
                <a href="#" class="text-decoration-none">
                  <div class="d-flex align-items-center text-primary">
                    <i class="bi bi-qq me-2"></i>
                    <span>QQ群</span>
                  </div>
                </a>
                <a href="#" class="text-decoration-none">
                  <div class="d-flex align-items-center text-success">
                    <i class="bi bi-wechat me-2"></i>
                    <span>微信</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 招新时间表 -->
      <div class="row mt-5 pt-5">
        <div class="col-12">
          <div class="bg-white rounded-4 p-4 text-dark">
            <h4 class="fw-bold mb-4 text-center">流程安排</h4>
            <div class="row text-center">
              <div class="col-md-3 mb-3">
                <div class="timeline-item">
                  <div
                    class="timeline-badge bg-success text-white rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center"
                    style="width: 60px; height: 60px;">
                    <i class="bi bi-calendar-check fs-5"></i>
                  </div>
                  <h6 class="fw-bold">报名阶段</h6>
                  <p class="text-muted small">在校期间</p>
                </div>
              </div>
              <div class="col-md-3 mb-3">
                <div class="timeline-item">
                  <div
                    class="timeline-badge bg-warning text-white rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center"
                    style="width: 60px; height: 60px;">
                    <i class="bi bi-people fs-5"></i>
                  </div>
                  <h6 class="fw-bold">面试选拔</h6>
                  <p class="text-muted small">报名后第二周</p>
                </div>
              </div>
              <div class="col-md-3 mb-3">
                <div class="timeline-item">
                  <div
                    class="timeline-badge bg-primary text-white rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center"
                    style="width: 60px; height: 60px;">
                    <i class="bi bi-flag fs-5"></i>
                  </div>
                  <h6 class="fw-bold">正式入社</h6>
                  <p class="text-muted small">选报后一周内</p>
                </div>
              </div>
              <div class="col-md-3 mb-3">
                <div class="timeline-item">
                  <div
                    class="timeline-badge bg-info text-white rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center"
                    style="width: 60px; height: 60px;">
                    <i class="bi bi-mortarboard fs-5"></i>
                  </div>
                  <h6 class="fw-bold">新生培训</h6>
                  <p class="text-muted small">入社后</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// 加入我们组件逻辑
</script>

<style scoped>
.join-form {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.benefit-item {
  font-size: 1.1rem;
}

.timeline-item {
  transition: transform 0.3s ease;
}

.timeline-item:hover {
  transform: translateY(-5px);
}

.form-control,
.form-select {
  border-radius: 10px;
  border: 2px solid #e9ecef;
  transition: all 0.3s ease;
}

.form-control:focus,
.form-select:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 0.2rem rgba(30, 60, 114, 0.25);
}
</style>
