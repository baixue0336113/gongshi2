package com.szxianyu.executive

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AssignmentTurnedIn
import androidx.compose.material.icons.filled.GppGood
import androidx.compose.material.icons.filled.Info
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.szxianyu.executive.ui.theme.*

@Composable
fun StrategicTrackingScreen() {
    LazyColumn(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                StatusCard("疲劳用工风险指数", "42.5", "warning", Modifier.weight(1f))
                StatusCard("劳务外包红线状态", "合规安全", "success", Modifier.weight(1f))
                StatusCard("跨厂区顶岗审计率", "100%", "success", Modifier.weight(1f))
            }
        }

        item {
            Text("核心监管部门状态", fontWeight = FontWeight.Bold, fontSize = 14.sp)
        }

        val depts = listOf(
            Triple("方便菜加工部", 5, "danger"),
            Triple("学生餐二车间", 3, "warning"),
            Triple("冷链配送部", 2, "warning")
        )

        items(depts) { (name, count, tone) ->
            DeptStatusItem(name, count, tone)
        }
    }
}

@Composable
fun StatusCard(label: String, value: String, tone: String, modifier: Modifier = Modifier) {
    Card(
        modifier = modifier,
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
    ) {
        Column(Modifier.padding(16.dp)) {
            Text(label, color = Slate500, fontSize = 11.sp)
            Spacer(Modifier.height(8.dp))
            Text(
                value,
                color = when(tone) {
                    "success" -> Emerald500
                    "warning" -> Orange500
                    else -> Rose500
                },
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold
            )
        }
    }
}

@Composable
fun DeptStatusItem(name: String, issueCount: Int, tone: String) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 0.5.dp)
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Surface(
                    color = when(tone) {
                        "danger" -> Rose500
                        "warning" -> Orange500
                        else -> Emerald500
                    },
                    shape = RoundedCornerShape(4.dp)
                ) {
                    Box(Modifier.size(8.dp))
                }
                Spacer(Modifier.width(12.dp))
                Text(name, fontWeight = FontWeight.Bold, fontSize = 13.sp)
            }
            Text("待办审计: $issueCount 项", color = Slate500, fontSize = 12.sp)
        }
    }
}
