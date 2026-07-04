package com.example.xianyu

import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun StudentMealCostScreen() {
    val days = (1..7).map { "07-0$it" }
    val depts = listOf("洗消组", "切配组", "分餐组", "仓储组", "物流组")

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF8FAFC))
            .padding(16.dp)
    ) {
        Text(
            "学生餐人工成本矩阵",
            fontSize = 14.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF1E293B),
            modifier = Modifier.padding(bottom = 12.dp)
        )

        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(8.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            border = BorderStroke(1.dp, Color(0xFFE2E8F0))
        ) {
            val horizontalScrollState = rememberScrollState()
            
            Column(modifier = Modifier.horizontalScroll(horizontalScrollState)) {
                // Header
                Row(
                    modifier = Modifier
                        .background(Color(0xFFF1F5F9))
                        .padding(vertical = 8.dp)
                ) {
                    Text(
                        "部门",
                        modifier = Modifier.width(80.dp).padding(start = 12.dp),
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF64748B)
                    )
                    days.forEach { day ->
                        Text(
                            day,
                            modifier = Modifier.width(90.dp),
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF64748B),
                            textAlign = androidx.compose.ui.text.style.TextAlign.Center
                        )
                    }
                }

                // Rows
                depts.forEach { dept ->
                    Row(
                        modifier = Modifier
                            .border(width = 0.5.dp, color = Color(0xFFF1F5F9))
                            .padding(vertical = 12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            dept,
                            modifier = Modifier.width(80.dp).padding(start = 12.dp),
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Medium,
                            color = Color(0xFF334155)
                        )
                        days.forEach { _ ->
                            CostCell()
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun CostCell() {
    Column(
        modifier = Modifier
            .width(90.dp)
            .padding(horizontal = 4.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text("¥320", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color(0xFF1E293B))
        Text("24h / 3人", fontSize = 8.sp, color = Color(0xFF94A3B8))
    }
}
