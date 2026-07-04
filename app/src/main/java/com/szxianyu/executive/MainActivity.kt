package com.szxianyu.executive

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.szxianyu.executive.ui.theme.*
import com.szxianyu.executive.data.XianyuRepository
import com.szxianyu.executive.data.api.XianyuApiService
import com.szxianyu.executive.ui.*
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

enum class Screen(val title: String, val icon: ImageVector, val category: String) {
    Overview("1. 经营总览", Icons.Default.Dashboard, "核心看板"),
    WorkMatrix("2. 工时矩阵", Icons.Default.GridOn, "核心看板"),
    TotalCostMatrix("3. 总成本矩阵", Icons.Default.Calculate, "核心看板"),
    StudentMealCost("4. 学生餐成本", Icons.Default.AttachMoney, "核心看板"),
    Department("5. 部门穿透", Icons.Default.Groups, "穿透诊断"),
    Employee("6. 员工画像", Icons.Default.Badge, "穿透诊断"),
    Support("7. 支援工时", Icons.Default.Sync, "专项分析"),
    Efficiency("8. 经营效率", Icons.Default.TrendingUp, "专项分析"),
    CostCenter("9. 成本中心", Icons.Default.PieChart, "专项分析"),
    PositionCost("10. 职位成本", Icons.Default.Work, "专项分析"),
    Risk("11. 风险管控", Icons.Default.Warning, "安全驾驶"),
    Strategic("12. 管理追踪", Icons.Default.ListAlt, "安全驾驶"),
    Baimao("13. 白猫工时/成本", Icons.Default.Star, "月度核算"),
    Campus("14. 校园兼职成本", Icons.Default.School, "月度核算"),
    Convenience("15. 方便菜肴工时", Icons.Default.AutoAwesome, "月度核算"),
    ThirdParty("16. 第三方工时/成本", Icons.Default.Layers, "月度核算")
}

class MainActivity : ComponentActivity() {
    private val retrofit = Retrofit.Builder()
        .baseUrl("https://www.szxianyu.net/")
        .addConverterFactory(GsonConverterFactory.create())
        .build()
    
    private val apiService = retrofit.create(XianyuApiService::class.java)
    private val repository = XianyuRepository(apiService)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            XianyuTheme {
                var token by remember { mutableStateOf<String?>(null) }
                var currentScreen by remember { mutableStateOf(Screen.Overview) }
                var isSidebarCollapsed by remember { mutableStateOf(false) }
                var selectedDate by remember { mutableStateOf("2026-07-02") }

                if (token == null) {
                    LoginScreen(apiService) { t, user -> token = t }
                } else {
                    MainScaffold(
                        currentScreen = currentScreen,
                        onScreenSelected = { 
                            currentScreen = it 
                        },
                        isCollapsed = isSidebarCollapsed,
                        onToggleSidebar = { isSidebarCollapsed = !isSidebarCollapsed },
                        onLogout = { token = null },
                        repo = repository,
                        token = token!!,
                        selectedDate = selectedDate,
                        onDateChange = { selectedDate = it }
                    )
                }
            }
        }
    }
}

@Composable
fun MainScaffold(
    currentScreen: Screen,
    onScreenSelected: (Screen) -> Unit,
    isCollapsed: Boolean,
    onToggleSidebar: () -> Unit,
    onLogout: () -> Unit,
    repo: XianyuRepository,
    token: String,
    selectedDate: String,
    onDateChange: (String) -> Unit
) {
    Row(modifier = Modifier.fillMaxSize()) {
        // Sidebar
        Sidebar(
            selectedScreen = currentScreen,
            onScreenSelected = onScreenSelected,
            isCollapsed = isCollapsed,
            onToggle = onToggleSidebar,
            onLogout = onLogout
        )

        // Main Content Area
        Column(modifier = Modifier.fillMaxSize().background(Slate50)) {
            // Top Bar
            TopBar(
                screen = currentScreen,
                selectedDate = selectedDate,
                onDateChange = onDateChange
            )

            // Content
            Box(modifier = Modifier.fillMaxSize().padding(16.dp)) {
                when (currentScreen) {
                    Screen.Overview -> OverviewScreen(repo, token, selectedDate)
                    Screen.WorkMatrix -> WorkMatrixScreen(repo, token)
                    Screen.TotalCostMatrix -> TotalCostMatrixScreen(repo, token)
                    Screen.StudentMealCost -> StudentMealCostScreen(repo, token)
                    Screen.Department -> DepartmentDetailScreen()
                    Screen.Employee -> EmployeePortraitScreen()
                    Screen.Support -> SupportHoursScreen()
                    Screen.Efficiency -> EfficiencyScreen()
                    Screen.CostCenter -> CostCenterScreen()
                    Screen.PositionCost -> PositionCostScreen()
                    Screen.Risk -> RiskControlScreen()
                    Screen.Strategic -> StrategicTrackingScreen()
                    Screen.Baimao -> BaimaoScreen(repo, token)
                    Screen.Campus -> CampusScreen(repo, token)
                    Screen.Convenience -> ConvenienceScreen(repo, token)
                    Screen.ThirdParty -> ThirdPartyScreen(repo, token)
                }
            }
        }
    }
}

@Composable
fun Sidebar(
    selectedScreen: Screen,
    onScreenSelected: (Screen) -> Unit,
    isCollapsed: Boolean,
    onToggle: () -> Unit,
    onLogout: () -> Unit
) {
    val categories = listOf("核心看板", "穿透诊断", "专项分析", "安全驾驶", "月度核算")

    Surface(
        modifier = Modifier
            .width(if (isCollapsed) 72.dp else 260.dp)
            .fillMaxHeight(),
        color = Slate900,
        tonalElevation = 8.dp
    ) {
        Column {
            // Header
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(64.dp)
                    .padding(horizontal = 16.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                if (!isCollapsed) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Card(
                            modifier = Modifier.size(32.dp),
                            shape = RoundedCornerShape(8.dp),
                            colors = CardDefaults.cardColors(containerColor = Orange500)
                        ) {
                            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                                Text("鲜", color = Slate950, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                            }
                        }
                        Spacer(Modifier.width(8.dp))
                        Column {
                            Text("鲜誉运营驾驶舱", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                            Text("EXECUTIVE COCKPIT", color = Orange400, fontSize = 8.sp)
                        }
                    }
                }
                IconButton(onClick = onToggle) {
                    Icon(
                        if (isCollapsed) Icons.Default.Menu else Icons.Default.ChevronLeft,
                        contentDescription = null,
                        tint = Slate400
                    )
                }
            }

            Divider(color = Slate800)

            // Grouped Category Menu Items
            LazyColumn(
                modifier = Modifier.weight(1f).padding(8.dp),
                verticalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                categories.forEach { category ->
                    val screensInCategory = Screen.values().filter { it.category == category }
                    
                    if (!isCollapsed) {
                        item {
                            Text(
                                text = category,
                                color = Orange400,
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.padding(start = 12.dp, top = 8.dp, bottom = 4.dp)
                            )
                        }
                    }
                    
                    items(screensInCategory) { screen ->
                        val isSelected = selectedScreen == screen
                        Surface(
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(40.dp)
                                .clickable { onScreenSelected(screen) },
                            color = if (isSelected) Orange500 else Color.Transparent,
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier.padding(horizontal = 12.dp)
                            ) {
                                Icon(
                                    screen.icon,
                                    contentDescription = null,
                                    tint = if (isSelected) Slate950 else Slate400,
                                    modifier = Modifier.size(16.dp)
                                )
                                if (!isCollapsed) {
                                    Spacer(Modifier.width(12.dp))
                                    Text(
                                        screen.title,
                                        color = if (isSelected) Slate950 else Slate300,
                                        fontSize = 11.sp,
                                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium
                                    )
                                }
                            }
                        }
                    }
                }
            }

            Divider(color = Slate800)

            // Footer
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = if (isCollapsed) Arrangement.Center else Arrangement.SpaceBetween
            ) {
                if (!isCollapsed) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Surface(
                            modifier = Modifier.size(32.dp),
                            shape = RoundedCornerShape(16.dp),
                            color = Slate800
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Icon(Icons.Default.Person, contentDescription = null, tint = Slate400, modifier = Modifier.size(16.dp))
                            }
                        }
                        Spacer(Modifier.width(8.dp))
                        Column {
                            Text("管理员", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 11.sp)
                            Text("审计授权: VIP", color = Slate500, fontSize = 9.sp)
                        }
                    }
                }
                IconButton(onClick = onLogout) {
                    Icon(Icons.Default.ExitToApp, contentDescription = null, tint = Slate400, modifier = Modifier.size(18.dp))
                }
            }
        }
    }
}

@Composable
fun TopBar(
    screen: Screen,
    selectedDate: String,
    onDateChange: (String) -> Unit
) {
    var expanded by remember { mutableStateOf(false) }
    val availableDates = listOf("2026-07-02", "2026-07-01", "2026-06-30", "2026-06-15", "2026-06-01", "2026-05-15")

    Surface(
        modifier = Modifier.fillMaxWidth().height(64.dp),
        color = Color.White,
        shadowElevation = 1.dp
    ) {
        Row(
            modifier = Modifier.fillMaxSize().padding(horizontal = 24.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    screen.title.substring(screen.title.indexOf(" ") + 1),
                    color = Slate900,
                    fontWeight = FontWeight.Bold,
                    fontSize = 16.sp
                )
                Spacer(Modifier.width(16.dp))
                VerticalDivider(modifier = Modifier.height(16.dp).padding(horizontal = 4.dp), color = Slate200)
                
                Box {
                    Surface(
                        color = Slate50,
                        shape = RoundedCornerShape(8.dp),
                        border = androidx.compose.foundation.BorderStroke(1.dp, Slate200),
                        modifier = Modifier.clickable { expanded = true }
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(Icons.Default.CalendarToday, contentDescription = null, tint = Orange500, modifier = Modifier.size(14.dp))
                            Spacer(Modifier.width(8.dp))
                            Text("审计工时日期:", color = Slate600, fontSize = 11.sp)
                            Spacer(Modifier.width(4.dp))
                            Text(selectedDate, color = Slate900, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                            Spacer(Modifier.width(4.dp))
                            Icon(Icons.Default.ArrowDropDown, contentDescription = null, tint = Slate500, modifier = Modifier.size(14.dp))
                        }
                    }

                    DropdownMenu(
                        expanded = expanded,
                        onDismissRequest = { expanded = false },
                        modifier = Modifier.background(Color.White)
                    ) {
                        availableDates.forEach { date ->
                            DropdownMenuItem(
                                text = { Text(date, fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Slate800) },
                                onClick = {
                                    onDateChange(date)
                                    expanded = false
                                }
                            )
                        }
                    }
                }
            }

            IconButton(onClick = { /* Refresh */ }) {
                Icon(Icons.Default.Refresh, contentDescription = null, tint = Slate400)
            }
        }
    }
}

@Composable
fun PlaceholderScreen(title: String) {
    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        Text("正在建设中: $title", color = Slate400)
    }
}
