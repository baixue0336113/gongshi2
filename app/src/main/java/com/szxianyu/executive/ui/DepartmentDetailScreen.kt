package com.szxianyu.executive.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
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
fun DepartmentDetailScreen() {
    LazyColumn(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Dept Header
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = Slate900),
                shape = RoundedCornerShape(16.dp)
            ) {
                Column(Modifier.padding(24.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Surface(color = Orange500, shape = RoundedCornerShape(8.dp)) {
                            Icon(Icons.Default.Groups, contentDescription = null, tint = Slate950, modifier = Modifier.padding(8.dp))
                        }
                        Spacer(Modifier.width(16.dp))
                        Column {
                            Text("学生餐二车间", color = Color.White, fontSize = 20.sp, fontWeight = FontWeight.Bold)
                            Text("核心生产部门 | 负责人: 王五", color = Slate400, fontSize = 12.sp)
                        }
                    }
                    
                    Spacer(Modifier.height(24.dp))
                    Row(horizontalArrangement = Arrangement.spacedBy(32.dp)) {
                        Column {
                            Text("本月总人数", color = Slate500, fontSize = 11.sp)
                            Text("124", color = Color.White, fontSize = 24.sp, fontWeight = FontWeight.Bold)
                        }
                        Column {
                            Text("总产出工时", color = Slate500, fontSize = 11.sp)
                            Text("2,480h", color = Color.White, fontSize = 24.sp, fontWeight = FontWeight.Bold)
                        }
                        Column {
                            Text("效能达标率", color = Slate500, fontSize = 11.sp)
                            Text("94.2%", color = Emerald500, fontSize = 24.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }

        // Personnel Structure
        item {
            Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                Card(
                    modifier = Modifier.weight(1f),
                    colors = CardDefaults.cardColors(containerColor = Color.White)
                ) {
                    Column(Modifier.padding(16.dp)) {
                        Text("人员构成分析", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        Spacer(Modifier.height(16.dp))
                        PersonnelItem("自有员工", 45, Blue500)
                        PersonnelItem("小时工", 52, Orange500)
                        PersonnelItem("第三方劳务", 27, Slate400)
                    }
                }

                Card(
                    modifier = Modifier.weight(1f),
                    colors = CardDefaults.cardColors(containerColor = Color.White)
                ) {
                    Column(Modifier.padding(16.dp)) {
                        Text("用工成本趋势 (本周)", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        Spacer(Modifier.height(16.dp))
                        // Placeholder for simple trend visual
                        Box(Modifier.fillMaxWidth().height(100.dp), contentAlignment = Alignment.Center) {
                            Text("Trend Chart Placeholder", color = Slate300, fontSize = 10.sp)
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun PersonnelItem(label: String, count: Int, color: Color) {
    Row(
        modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Box(Modifier.size(8.dp).background(color, CircleShape))
            Spacer(Modifier.width(8.dp))
            Text(label, fontSize = 12.sp, color = Slate600)
        }
        Text("$count 人", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Slate900)
    }
}
