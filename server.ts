import express from "express";
import path from "path";
import https from "https";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // --- New Hand-off REST APIs for HR Monthly Check Modules ---
  // 1. 白猫工时/成本核算
  app.get("/api/plugins/hr/monthly-check/baimao", (req, res) => {
    const review_date = req.query.month || req.query.review_date || "2026-06";
    res.json({
      month: review_date,
      meta: {
        total_headcount: 45,
        total_audited_hours: 8640,
        total_payroll_cost: 216000,
        verified_ratio: 92.5
      },
      data: [
        { id: "BM-001", name: "张明", department: "学生餐一车间", regular_hours: 160, overtime_hours: 24, total_hours: 184, hourly_rate: 22, salary: 4048, allowance: 300, insurance: 850, net_cost: 5198, status: "已核准", auditor: "王建国", time: "2026-06-28" },
        { id: "BM-002", name: "李静", department: "学生餐一车间", regular_hours: 160, overtime_hours: 16, total_hours: 176, hourly_rate: 22, salary: 3872, allowance: 300, insurance: 850, net_cost: 5022, status: "已核准", auditor: "王建国", time: "2026-06-28" },
        { id: "BM-003", name: "王超", department: "方便菜包装线", regular_hours: 160, overtime_hours: 32, total_hours: 192, hourly_rate: 25, salary: 4800, allowance: 350, insurance: 920, net_cost: 6070, status: "争议中", auditor: "李志刚", time: "2026-06-29" },
        { id: "BM-004", name: "赵刚", department: "冷链分拣部", regular_hours: 160, overtime_hours: 8, total_hours: 168, hourly_rate: 20, salary: 3360, allowance: 200, insurance: 800, net_cost: 4360, status: "已核准", auditor: "张红", time: "2026-06-28" },
        { id: "BM-005", name: "钱华", department: "方便菜包装线", regular_hours: 160, overtime_hours: 20, total_hours: 180, hourly_rate: 25, salary: 4500, allowance: 350, insurance: 920, net_cost: 5770, status: "待确认", auditor: "李志刚", time: "2026-06-30" },
        { id: "BM-006", name: "孙利", department: "学生餐二车间", regular_hours: 160, overtime_hours: 30, total_hours: 190, hourly_rate: 22, salary: 4180, allowance: 300, insurance: 850, net_cost: 5330, status: "已核准", auditor: "王建国", time: "2026-06-28" },
        { id: "BM-007", name: "周强", department: "冷链分拣部", regular_hours: 160, overtime_hours: 12, total_hours: 172, hourly_rate: 20, salary: 3440, allowance: 200, insurance: 800, net_cost: 4440, status: "已核准", auditor: "张红", time: "2026-06-28" }
      ]
    });
  });

  // 2. 校园兼职成本核算
  app.get("/api/plugins/hr/monthly-check/campus-part-time", (req, res) => {
    const review_date = req.query.month || req.query.review_date || "2026-06";
    res.json({
      month: review_date,
      meta: {
        campus_partners: 4,
        active_students: 124,
        total_payout: 98450,
        average_hourly_rate: 18.5
      },
      data: [
        { id: "CP-101", student_name: "陈波", school: "杭州电子科技大学", work_type: "包装线协助", total_hours: 48, hourly_rate: 18, incentive: 100, agency_fee: 50, total_cost: 1014, bank_status: "打款成功", audit_time: "2026-06-25 14:00" },
        { id: "CP-102", student_name: "林小妙", school: "浙江工业大学", work_type: "分拣打标", total_hours: 36, hourly_rate: 18, incentive: 50, agency_fee: 30, total_cost: 728, bank_status: "打款成功", audit_time: "2026-06-25 14:15" },
        { id: "CP-103", student_name: "周杰", school: "浙江工商大学", work_type: "包装线协助", total_hours: 50, hourly_rate: 18, incentive: 120, agency_fee: 50, total_cost: 1070, bank_status: "处理中", audit_time: "2026-06-26 09:30" },
        { id: "CP-104", student_name: "徐婷婷", school: "杭州师范大学", work_type: "文书整理", total_hours: 24, hourly_rate: 20, incentive: 0, agency_fee: 20, total_cost: 500, bank_status: "信息有误", audit_time: "2026-06-26 10:10" },
        { id: "CP-105", student_name: "高远", school: "浙江工业大学", work_type: "冷链装箱", total_hours: 60, hourly_rate: 18, incentive: 150, agency_fee: 60, total_cost: 1290, bank_status: "打款成功", audit_time: "2026-06-25 15:00" },
        { id: "CP-106", student_name: "吴萌", school: "杭州电子科技大学", work_type: "分拣打标", total_hours: 42, hourly_rate: 18, incentive: 80, agency_fee: 40, total_cost: 876, bank_status: "打款成功", audit_time: "2026-06-25 15:30" }
      ]
    });
  });

  // 3. 方便菜肴工时/成本核算
  app.get("/api/plugins/hr/monthly-check/convenience", (req, res) => {
    const review_date = req.query.month || req.query.review_date || "2026-06";
    res.json({
      month: review_date,
      meta: {
        product_lines: 3,
        output_boxes: 18500,
        standard_labor_cost: 4.5,
        actual_labor_cost: 4.25
      },
      data: [
        { id: "CV-201", batch_no: "BATCH-20260611A", line_name: "红烧肉调理线", standard_hours: 120, actual_hours: 114, efficiency_variance: -5.0, headcount: 15, output_qty: 3500, unit_labor_cost: 4.1, material_waste_rate: 1.2, status: "优秀", audited_by: "陈建" },
        { id: "CV-202", batch_no: "BATCH-20260612B", line_name: "黑椒牛柳分切包装线", standard_hours: 90, actual_hours: 98, efficiency_variance: 8.8, headcount: 12, output_qty: 2400, unit_labor_cost: 4.6, material_waste_rate: 1.8, status: "一般", audited_by: "赵一鸣" },
        { id: "CV-203", batch_no: "BATCH-20260615A", line_name: "红烧肉调理线", standard_hours: 120, actual_hours: 125, efficiency_variance: 4.1, headcount: 15, output_qty: 3600, unit_labor_cost: 4.3, material_waste_rate: 1.4, status: "优秀", audited_by: "陈建" },
        { id: "CV-204", batch_no: "BATCH-20260618C", line_name: "香菇滑鸡调理配料线", standard_hours: 80, actual_hours: 92, efficiency_variance: 15.0, headcount: 10, output_qty: 2000, unit_labor_cost: 4.9, material_waste_rate: 2.5, status: "低下", audited_by: "钱卫东" },
        { id: "CV-205", batch_no: "BATCH-20260620A", line_name: "黑椒牛柳分切包装线", standard_hours: 90, actual_hours: 88, efficiency_variance: -2.2, headcount: 12, output_qty: 2500, unit_labor_cost: 4.0, material_waste_rate: 1.1, status: "优秀", audited_by: "赵一鸣" }
      ]
    });
  });

  // 4. 第三方劳务工时/成本核算
  app.get("/api/plugins/hr/monthly-check/third-party", (req, res) => {
    const review_date = req.query.month || req.query.review_date || "2026-06";
    res.json({
      month: review_date,
      meta: {
        vendors_count: 3,
        dispatched_count: 145,
        total_billing: 342500,
        average_compliance_score: 94.5
      },
      data: [
        { id: "TP-301", vendor_name: "万宝盛华劳务派遣有限公司", dispatched_headcount: 65, audited_hours: 11200, billing_rate: 22, platform_service_fee: 12320, total_amount: 258720, invoice_status: "已开具专票", compliance_score: 96, audit_status: "终审完成", verify_time: "2026-06-27" },
        { id: "TP-302", vendor_name: "杭州中力劳务外包服务部", dispatched_headcount: 50, audited_hours: 8400, billing_rate: 20, platform_service_fee: 8400, total_amount: 176400, invoice_status: "待收专票", compliance_score: 92, audit_status: "一审通过", verify_time: "2026-06-28" },
        { id: "TP-303", vendor_name: "浙江顺捷人力资源管理公司", dispatched_headcount: 30, audited_hours: 4800, billing_rate: 21, platform_service_fee: 5040, total_amount: 105840, invoice_status: "已开具专票", compliance_score: 95, audit_status: "终审完成", verify_time: "2026-06-27" }
      ]
    });
  });

  // Custom transparent reverse-proxy for the Xianyu production API endpoints
  app.all("/api/*", (req, res) => {
    const targetHost = "www.szxianyu.net";
    const targetPath = req.originalUrl;

    const headers = { ...req.headers };
    headers.host = targetHost; // Overwrite host header for routing

    // Remove any client-specific connections headers to prevent hang-ups
    delete headers.connection;
    delete headers["keep-alive"];

    const proxyReq = https.request(
      {
        host: targetHost,
        path: targetPath,
        method: req.method,
        headers: headers,
      },
      (proxyRes) => {
        // Set same status code and forward response headers
        res.status(proxyRes.statusCode || 500);
        Object.entries(proxyRes.headers).forEach(([key, val]) => {
          if (val !== undefined) {
            res.setHeader(key, val);
          }
        });
        proxyRes.pipe(res);
      }
    );

    proxyReq.on("error", (err) => {
      console.error("API Proxy Error:", err);
      // Give a JSON 502, the React client will gracefully fall back to full interactive mock mode
      res.status(502).json({
        error: "Bad Gateway",
        message: "无法连接到鲜誉经营舱服务器，请检查网络或切换为模拟数据模式。",
        details: err.message
      });
    });

    // Pipe the incoming request body to the outgoing proxy request
    req.pipe(proxyReq);
  });

  // Setup Vite development server or production static serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Xianyu Cockpit Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
