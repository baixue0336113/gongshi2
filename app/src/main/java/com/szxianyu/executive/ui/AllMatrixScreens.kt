package com.szxianyu.executive.ui

import androidx.compose.runtime.*
import com.szxianyu.executive.data.XianyuRepository
import com.szxianyu.executive.data.models.MatrixData
import kotlinx.coroutines.launch

@Composable
fun MatrixScreenContainer(
    repo: XianyuRepository,
    token: String,
    title: String,
    fetchData: suspend (String) -> MatrixData?,
    mockTitle: String
) {
    val scope = rememberCoroutineScope()
    var matrixData by remember { mutableStateOf<MatrixData?>(null) }
    var isLoading by remember { mutableStateOf(false) }
    var selectedMonth by remember { mutableStateOf("2026-07") }

    val days = matrixData?.days ?: (1..31).map { it.toString() }
    val rows = remember(matrixData) { repo.convertToUiRows(matrixData, mockTitle) }
    val kbi = remember(matrixData) { repo.convertToUiKbi(matrixData, mockTitle) }

    LaunchedEffect(selectedMonth) {
        isLoading = true
        matrixData = fetchData(selectedMonth)
        isLoading = false
    }

    MatrixBase(
        title = title,
        days = days,
        rows = rows,
        selectedMonth = selectedMonth,
        kbiSummary = kbi,
        onMonthChange = { selectedMonth = it }
    )
}

@Composable
fun WorkMatrixScreen(repo: XianyuRepository, token: String) {
    MatrixScreenContainer(
        repo = repo,
        token = token,
        title = "月度工时穿透矩阵",
        fetchData = { repo.getWorkMatrix(token, it) },
        mockTitle = "工时矩阵"
    )
}

@Composable
fun TotalCostMatrixScreen(repo: XianyuRepository, token: String) {
    MatrixScreenContainer(
        repo = repo,
        token = token,
        title = "月度全口径成本矩阵",
        fetchData = { repo.getTotalCostMatrix(token, it) },
        mockTitle = "总成本矩阵"
    )
}

@Composable
fun BaimaoScreen(repo: XianyuRepository, token: String) {
    MatrixScreenContainer(
        repo = repo,
        token = token,
        title = "白猫工厂工时与成本核算",
        fetchData = { repo.getBaimaoData(token, it) },
        mockTitle = "白猫"
    )
}

@Composable
fun CampusScreen(repo: XianyuRepository, token: String) {
    MatrixScreenContainer(
        repo = repo,
        token = token,
        title = "校园兼职用工成本矩阵",
        fetchData = { repo.getCampusData(token, it) },
        mockTitle = "校园兼职"
    )
}

@Composable
fun ConvenienceScreen(repo: XianyuRepository, token: String) {
    MatrixScreenContainer(
        repo = repo,
        token = token,
        title = "方便菜肴事业部核算矩阵",
        fetchData = { repo.getConvenienceData(token, it) },
        mockTitle = "方便菜肴"
    )
}

@Composable
fun ThirdPartyScreen(repo: XianyuRepository, token: String) {
    MatrixScreenContainer(
        repo = repo,
        token = token,
        title = "第三方派遣劳务核算矩阵",
        fetchData = { repo.getThirdPartyData(token, it) },
        mockTitle = "第三方"
    )
}
