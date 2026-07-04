package com.example.xianyu

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

data class RiskItem(
    val title: String,
    val level: String, // 高 | 中 | 低
    val count: String,
    val description: String
)

@Composable
fun RiskControlScreen() {
    val risks = listOf(
        RiskItem("加班超时严重", "高", "8人", "本周已有8人连续加班超过12小时"),
        RiskItem("对账合规性波动", "中", "15.4%", "近期洗消组对账成功率下降"),
        RiskItem("异常离岗频发", "低", "3次", "今日下午切配组有小范围异常离岗")
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF8FAFC))
            .padding(16.dp)
    ) {
        Text(
            "智能风险管控与异常预警",
            fontSize = 14.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF1E293B),
            modifier = Modifier.padding(bottom = 12.dp)
        )

        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(risks) { risk ->
                RiskCard(risk)
            }
        }
    }
}

@Composable
fun RiskCard(risk: RiskItem) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
    ) {
        Column(Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .background(
                                color = when(risk.level) {
                                    "高" -> Color(0xFFEF4444)
                                    "中" -> Color(0xFFF59E0B)
                                    else -> Color(0xFF3B82F6)
                                },
                                shape = RoundedCornerShape(4.dp)
                            )
                            .padding(horizontal = 6.dp, vertical = 2.dp)
                    ) {
                        Text(risk.level, color = Color.White, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                    }
                    Spacer(Modifier.width(8.dp))
                    Text(risk.title, fontWeight = FontWeight.Bold, fontSize = 13.sp, color = Color(0xFF1E293B))
                }
                Text(risk.count, fontWeight = FontWeight.Bold, fontSize = 13.sp, color = Color(0xFF1E293B))
            }
            Spacer(Modifier.height(8.dp))
            Text(risk.description, fontSize = 11.sp, color = Color(0xFF64748B))
            
            Spacer(Modifier.height(12.dp))
            Button(
                onClick = { /* Handle drill down */ },
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFF1F5F9)),
                contentPadding = PaddingValues(0.dp)
            ) {
                Text("查看预警穿透详情", color = Color(0xFF475569), fontSize = 10.sp)
            }
        }
    }
}
