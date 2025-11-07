<!-- src/components/Layout/Footer.vue -->
<template>
  <footer class="footer bg-dark text-white py-5">
    <div class="container">
      <div class="row g-4">
        <div class="col-lg-4">
          <div class="footer-about">
            <h5 class="fw-bold mb-3">
              <i class="bi bi-cpu-fill me-2"></i>
              海口市第四中学展翼科技社
            </h5>
            <p class="text-muted">
              探索科技，创造未来。我们致力于培养学生的科技创新能力和实践能力。
            </p>
            <div class="mt-3">
              <span class="fw-semibold">联系我们:</span>
              <a href="#" class="text-decoration-none ms-2 text-light">点击查看联系方式</a>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="footer-links">
            <h6 class="fw-bold mb-3">快速链接</h6>
            <div class="d-flex flex-column gap-2">
              <a href="https://yt437700.top" class="text-decoration-none text-light">yt437700</a>
              <a href="/member/" class="text-decoration-none text-light">成员登录入口</a>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="footer-contact text-lg-end">
            <!-- <h6 class="fw-bold mb-3">关注我们</h6>
            <div class="d-flex justify-content-lg-end gap-3 mb-3">
              <a href="#" class="text-white fs-5"><i class="bi bi-qq"></i></a>
              <a href="#" class="text-white fs-5"><i class="bi bi-wechat"></i></a>
              <a href="#" class="text-white fs-5"><i class="bi bi-github"></i></a>
            </div> -->
            <!-- 技术栈 -->
            <div class="mb-3">
              <h6 class="fw-bold mb-2 text-light">构成</h6>
              <div class="d-flex justify-content-lg-end flex-wrap gap-2">
                <span class="badge bg-success d-flex align-items-center">
                  <i class="bi bi-file-code me-1"></i> Vue 3
                </span>
                <span class="badge bg-info d-flex align-items-center">
                  <i class="bi bi-filetype-tsx me-1"></i> TypeScript
                </span>
                <span class="badge bg-warning text-dark d-flex align-items-center">
                  <i class="bi bi-filetype-html me-1"></i> HTML
                </span>
                <span class="badge bg-primary d-flex align-items-center">
                  <i class="bi bi-bootstrap me-1"></i> Bootstrap
                </span>
              </div>
              <a href="https://github.com/anndfine/hnhksz-kjs" class="text-white nav-link"><i
                  class="bi bi-github">&nbsp;</i>Bug反馈 | 提供建议 | 贡献代码</a>
              <a href="/help/" class="text-white nav-link">
                <i class="bi bi-book">&nbsp;</i>新手入门指南
              </a>

            </div>
            <div class="text-secondary small">
              <div>Copyright &copy; 2025 海口市第四中学展翼科技社</div>
              <div>All Rights Reserved</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// 页脚组件逻辑
</script>
