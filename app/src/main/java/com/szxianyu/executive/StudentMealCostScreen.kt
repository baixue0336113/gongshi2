package com.szxianyu.executive

import androidx.compose.runtime.*
import com.szxianyu.executive.data.XianyuRepository
import com.szxianyu.executive.ui.MatrixBase

@Composable
fun StudentMealCostScreen(repo: XianyuRepository) {
    val days = (1..31).map { it.toString() }
    val rows = remember { repo.getMockMatrixData("学生餐成本") }
    val kbi = remember { repo.getMockKbi("学生餐成本") }
    
    MatrixBase(
        title = "学生餐单餐成本穿透矩阵",
        days = days,
        rows = rows,
        kbiSummary = kbi,
        onMonthChange = {}
    )
}
