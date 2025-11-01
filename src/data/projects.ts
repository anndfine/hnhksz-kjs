// src/data/projects.ts
export interface Project {
  id: number;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'planned';
  technologies: string[];
  participants: string[];
  startDate: string;
  endDate?: string;
  icon: string;
  color: string;
}

export const projects: Project[] = [
  {
    id: 1,
    title: "校园气象站",
    description: "气象监测设备，能够实时采集温度、湿度、气压等数据并通过屏幕显示。",
    status: "completed",
    technologies: ["传感器", "物联网"],
    participants: ["数据缺失"],
    startDate: "数据缺失",
    endDate: "数据缺失",
    icon: "bi-motherboard",
    color: "bg-info"
  },
  {
    id: 2,
    title: "校园草本植物科普",
    description: "通过多媒体形式展示校园内常见草本植物，制作科普资料和展示板。",
    status: "completed",
    technologies: ["多媒体制作", "资料整理"],
    participants: ["张xx"],
    startDate: "2025.07",
    endDate: "2025.07",
    icon: "bi-flower1",
    color: "bg-success"
  },
  {
    id: 3,
    title: "传统香囊制作",
    description: "结合传统文化与现代工艺，研究并制作具有科技元素的传统香囊。",
    status: "in-progress",
    technologies: ["传统工艺", "材料研究"],
    participants: ["张xx", "王xx"],
    startDate: "2025.09",
    icon: "bi-bag",
    color: "bg-warning"
  },
  {
    id: 4,
    title: "自行车发电研究",
    description: "研究自行车运动发电原理，设计并制作小型发电装置。",
    status: "completed",
    technologies: ["发电原理", "机械设计"],
    participants: ["伯xx"],
    startDate: "2025.10",
    endDate: "2025.10",
    icon: "bi-bicycle",
    color: "bg-primary"
  },
  {
    id: 5,
    title: "3D打印创意作品",
    description: "使用3D打印技术制作各种创意作品，包括模型设计和打印工艺研究。",
    status: "in-progress",
    technologies: ["3D建模", "3D打印机", "3D打印"],
    participants: ["唐xx", "王xx"],
    startDate: "2025.11",
    icon: "bi-printer",
    color: "bg-warning"
  },
  {
    id: 6,
    title: "科技社物联网改造",
    description: "基于物联网技术的智慧校园解决方案，实现智能设备远程控制和数据采集。",
    status: "planned",
    technologies: ["开发板", "Node.JS", "C++"],
    participants: ["王xx", "唐xx", "张xx"],
    startDate: "2025.11",
    icon: "bi-robot",
    color: "bg-secondary"
  }
];
