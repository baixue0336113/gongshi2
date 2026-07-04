package com.example.xianyu

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun EfficiencyScreen() {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF8FAFC))
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            EfficiencyTrendCard()
        }
        
        item {
            WorkshopRankCard()
        }
    }
}

@Composable
fun EfficiencyTrendCard() {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
    ) {
        Column(Modifier.padding(16.dp)) {
            Text(
                "全量工时效能波动趋势",
                fontWeight = FontWeight.Bold,
                fontSize = 12.sp,
                color = Color(0xFF1E293B)
            )
            Spacer(Modifier.height(16.dp))
            
            // Simple Line Chart Drawing
            Canvas(modifier = Modifier
                .fillMaxWidth()
                .height(120.dp)) {
                val path = Path().apply {
                    moveTo(0f, size.height * 0.8f)
                    lineTo(size.width * 0.2f, size.height * 0.6f)
                    lineTo(size.width * 0.4f, size.height * 0.7f)
                    lineTo(size.width * 0.6f, size.height * 0.4f)
                    lineTo(size.width * 0.8f, size.height * 0.5f)
                    lineTo(size.width, size.height * 0.2f)
                }
                drawPath(
                    path = path,
                    color = Color(0xFFF97316),
                    style = Stroke(width = 2.dp.toPx())
                )
            }
        }
    }
}

@Composable
fun WorkshopRankCard() {
    val ranks = listOf(
        Pair("洗消一车间", 96),
        Pair("切配二组", 92),
        Pair("包装生产线", 88),
        Pair("分餐班组", 85)
    )

    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
    ) {
        Column(Modifier.padding(16.dp)) {
            Text(
                "二级部门工时效率排行",
                fontWeight = FontWeight.Bold,
                fontSize = 12.sp,
                color = Color(0xFF1E293B)
            )
            Spacer(Modifier.height(12.dp))
            
            ranks.forEach { (name, score) ->
                Column(Modifier.padding(vertical = 4.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(name, fontSize = 11.sp, color = Color(0xFF64748B))
                        Text("$score%", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1E293B))
                    }
                    Spacer(Modifier.height(4.dp))
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(6.dp)
                            .background(Color(0xFFF1F5F9), RoundedCornerShape(3.dp))
                    ) {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth(score / 100f)
                                .height(6.dp)
                                .background(Color(0xFF3B82F6), RoundedCornerShape(3.dp))
                        )
                    }
                }
            }
        }
    }
}
