package com.szxianyu.executive.ui

import androidx.compose.runtime.*
import com.szxianyu.executive.data.XianyuRepository

@Composable
fun WorkMatrixScreen(repo: XianyuRepository) {
    val days = (1..31).map { it.toString() }
    val rows = remember { repo.getMockMatrixData("工时矩阵") }
    val kbi = remember { repo.getMockKbi("工时矩阵") }
    
    MatrixBase(
        title = "月度工时穿透矩阵",
        days = days,
        rows = rows,
        kbiSummary = kbi,
        onMonthChange = {}
    )
}

@Composable
fun TotalCostMatrixScreen(repo: XianyuRepository) {
    val days = (1..31).map { it.toString() }
    val rows = remember { repo.getMockMatrixData("总成本矩阵") }
    val kbi = remember { repo.getMockKbi("总成本矩阵") }
    
    MatrixBase(
        title = "月度全口径成本矩阵",
        days = days,
        rows = rows,
        kbiSummary = kbi,
        onMonthChange = {}
    )
}

@Composable
fun BaimaoScreen(repo: XianyuRepository) {
    val days = (1..31).map { it.toString() }
    val rows = remember { repo.getMockMatrixData("白猫") }
    val kbi = remember { repo.getMockKbi("白猫") }
    
    MatrixBase(
        title = "白猫工厂工时与成本核算",
        days = days,
        rows = rows,
        kbiSummary = kbi,
        onMonthChange = {}
    )
}

@Composable
fun CampusScreen(repo: XianyuRepository) {
    val days = (1..31).map { it.toString() }
    val rows = remember { repo.getMockMatrixData("校园兼职") }
    val kbi = remember { repo.getMockKbi("校园兼职") }
    
    MatrixBase(
        title = "校园兼职用工成本矩阵",
        days = days,
        rows = rows,
        kbiSummary = kbi,
        onMonthChange = {}
    )
}

@Composable
fun ConvenienceScreen(repo: XianyuRepository) {
    val days = (1..31).map { it.toString() }
    val rows = remember { repo.getMockMatrixData("方便菜肴") }
    val kbi = remember { repo.getMockKbi("方便菜肴") }
    
    MatrixBase(
        title = "方便菜肴事业部核算矩阵",
        days = days,
        rows = rows,
        kbiSummary = kbi,
        onMonthChange = {}
    )
}

@Composable
fun ThirdPartyScreen(repo: XianyuRepository) {
    val days = (1..31).map { it.toString() }
    val rows = remember { repo.getMockMatrixData("第三方") }
    val kbi = remember { repo.getMockKbi("第三方") }
    
    MatrixBase(
        title = "第三方派遣劳务核算矩阵",
        days = days,
        rows = rows,
        kbiSummary = kbi,
        onMonthChange = {}
    )
}
