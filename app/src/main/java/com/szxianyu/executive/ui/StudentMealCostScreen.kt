package com.szxianyu.executive.ui

import androidx.compose.runtime.*
import com.szxianyu.executive.data.XianyuRepository

@Composable
fun StudentMealCostScreen(repo: XianyuRepository, token: String) {
    MatrixScreenContainer(
        repo = repo,
        token = token,
        title = "学生餐单餐成本穿透矩阵",
        fetchData = { repo.getStudentMealCost(token, it) },
        mockTitle = "学生餐成本"
    )
}
