package com.szxianyu.executive

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.szxianyu.executive.ui.theme.*

@Composable
fun MatrixScreen() {
    var selectedScope by remember { mutableStateOf("work_matrix") }
    val scopes = listOf(
        "work_matrix" to "工时矩阵",
        "student_meal" to "学生餐成本",
        "total_cost" to "总成本矩阵"
    )
    
    val days = (1..30).map { it.toString() }
    val rows = listOf("学生餐一车间", "学生餐二车间", "方便菜加工部", "净菜生产线", "面点面食车间")

    Column(modifier = Modifier.fillMaxSize().background(Color.White)) {
        // Scope Selector
        ScrollableTabRow(
            selectedTabIndex = scopes.indexOfFirst { it.first == selectedScope },
            containerColor = Color.White,
            contentColor = Orange500,
            edgePadding = 16.dp,
            divider = {}
        ) {
            scopes.forEach { (id, label) ->
                Tab(
                    selected = selectedScope == id,
                    onClick = { selectedScope = id },
                    text = { Text(label, fontSize = 12.sp, fontWeight = FontWeight.Bold) }
                )
            }
        }

        // Table Header
        Row(modifier = Modifier.fillMaxWidth().background(Slate50).border(1.dp, Slate200)) {
            Box(Modifier.width(160.dp).padding(12.dp)) {
                Text("部门名称", fontWeight = FontWeight.Bold, fontSize = 12.sp)
            }
            Box(Modifier.width(80.dp).padding(12.dp)) {
                Text("总计", fontWeight = FontWeight.Bold, fontSize = 12.sp, textAlign = TextAlign.Center)
            }
            LazyRow(modifier = Modifier.weight(1f)) {
                items(days) { day ->
                    Box(Modifier.width(40.dp).padding(vertical = 12.dp), contentAlignment = Alignment.Center) {
                        Text(day, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Slate500)
                    }
                }
            }
        }

        // Table Body
        LazyColumn(modifier = Modifier.fillMaxSize()) {
            items(rows) { rowName ->
                Row(modifier = Modifier.fillMaxWidth().border(0.5.dp, Slate100)) {
                    Box(Modifier.width(160.dp).padding(12.dp)) {
                        Text(rowName, fontSize = 12.sp, color = Slate900)
                    }
                    Box(Modifier.width(80.dp).padding(12.dp), contentAlignment = Alignment.Center) {
                        Text("4,520", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Slate900)
                    }
                    LazyRow(modifier = Modifier.weight(1f)) {
                        items(days) { day ->
                            val value = (120..180).random()
                            Box(
                                modifier = Modifier
                                    .width(40.dp)
                                    .height(44.dp)
                                    .background(if (value > 150) Color(0xFFFEF2F2) else Color.Transparent)
                                    .border(0.2.dp, Slate100),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(
                                    value.toString(),
                                    fontSize = 10.sp,
                                    color = if (value > 150) Rose500 else Slate600
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}
