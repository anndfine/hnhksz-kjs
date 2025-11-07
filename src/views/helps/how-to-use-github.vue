<template>
    <div class="container py-5">
        <h1 class="display-4 fw-bold mb-4">🐣 新手入门指南</h1>

        <div class="row">
            <div class="col-lg-8">
                <!-- GitHub 基础使用 -->
                <div class="card mb-3">
                    <div class="card-header bg-light">
                        <h5 class="mb-0">📖 GitHub 基础操作</h5>
                    </div>
                    <div class="card-body">
                        <div class="alert alert-warning border mb-4">
                            <div class="d-flex align-items-center mb-2">
                                <span class="badge bg-warning text-dark me-2">💡</span>
                                <strong class="h6 mb-0">开始之前</strong>
                            </div>
                            <p class="mb-0">如果你是GitHub新手，建议先了解<a href="https://www.runoob.com/w3cnote/git-guide.html"
                                    class="fw-medium">GitHub基础知识</a> | <a
                                    href="https://zhuanlan.zhihu.com/p/369486197">图文详解</a>
                            </p>
                        </div>
                        <div class="mb-4">
                            <h6 class="mb-2">1. 确认 GitHub 账号已经登录</h6>
                        </div>

                        <div class="mb-4">
                            <h6 class="mb-2">2. 找到我们的项目</h6>
                            <p class="mb-0">访问：<a href="https://github.com/anndfine/hnhksz-kjs"
                                    class="fw-medium">hnhksz-kjs 项目</a></p>
                        </div>

                        <div class="mb-4">
                            <h6 class="mb-2">3. 提交 Issue（问题反馈）</h6>
                            <div class="ps-3">
                                <ol class="mb-3">
                                    <li class="mb-2">点击项目的 "Issues" 标签</li>
                                    <li class="mb-2">点击 "New Issue" 按钮</li>
                                    <li class="mb-2">在右侧填写正确的信息</li>
                                    <li class="mb-2">填写问题描述或建议</li>
                                    <li class="mb-2">点击 "Create" 的绿色按钮</li>
                                </ol>

                                <div class="alert alert-info border mb-3">
                                    <strong class="d-block mb-2">📝 填写信息说明：</strong>
                                    <ul class="mb-0">
                                        <li><strong>Assignees（可选）</strong> - 将问题分配给特定的成员</li>
                                        <li><strong>Labels（必选）</strong> - 用于分类问题或建议</li>
                                    </ul>
                                </div>



                                <div class="alert alert-warning border mb-3">
                                    <strong class="d-block mb-2">🔖 如何选择Labels?</strong>
                                    <ul class="mb-0">
                                        <li><strong>Bug</strong> - 报告问题或错误</li>
                                        <li><strong>Enhancement</strong> - 建议改进或新功能</li>
                                        <li><strong>Feature</strong> - 新功能建议</li>
                                        <li><strong>Documentation</strong> - 文档改进建议</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 贡献代码指南 -->
                <div class="card mb-3">
                    <div class="card-header bg-light">
                        <h5 class="mb-0">💻 如何贡献代码</h5>
                    </div>
                    <div class="card-body">
                        <h6>Fork & Pull Request 流程</h6>
                        <p class="mb-0">要贡献代码，你需要先 Fork 项目到你的 GitHub 账号，然后通过 Pull Request 提交变更。</p>
                        <p>首先，请确保你的 GitHub 账号已经登录，并且电脑已经安装了 <a href="https://git-scm.com/"
                                class="fw-medium">Git</a>（安装教程可以参考 <a
                                href="https://blog.csdn.net/mukes/article/details/115693833">这片文章</a>）。
                        </p>

                        <ol>
                            <li>点击项目页面的 "Fork" 按钮</li>
                            <li>将项目克隆到本地：<code>git clone [你的仓库地址]</code></li>
                            <li>创建新分支：<code>git checkout -b feature/你的功能</code></li>
                            <li>提交代码并推送到你的仓库</li>
                            <li>在 GitHub 创建 Pull Request</li>
                        </ol>
                    </div>
                </div>


            </div>

            <div class="col-lg-4">
                <!-- 快速链接 -->
                <div class="card sticky-top" style="top: 100px;">
                    <div class="card-body">
                        <h5>🔗 快速链接</h5>
                        <div class="list-group list-group-flush">
                            <a href="https://github.com/anndfine/hnhksz-kjs/issues"
                                class="list-group-item list-group-item-action" target="_blank">
                                <i class="bi bi-bug"></i> 报告问题
                            </a>
                            <a href="https://github.com/anndfine/hnhksz-kjs/discussions"
                                class="list-group-item list-group-item-action" target="_blank">
                                <i class="bi bi-chat-dots"></i> 参与讨论
                            </a>
                            <a href="https://github.com/anndfine/hnhksz-kjs/pulls"
                                class="list-group-item list-group-item-action" target="_blank">
                                <i class="bi bi-code-slash"></i> 查看 Pull Requests
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>