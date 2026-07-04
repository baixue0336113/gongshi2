package com.szxianyu.executive.ui

import androidx.compose.foundation.background
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
import com.szxianyu.executive.ui.theme.*

@Composable
fun CostCenterScreen() {
    LazyColumn(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = Color.White)
            ) {
                Column(Modifier.padding(16.dp)) {
                    Text("成本中心分布分析", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                    Spacer(Modifier.height(16.dp))
                    CostCenterItem("学生餐一部", "¥324,500", 35, Blue500)
                    CostCenterItem("学生餐二部", "¥412,800", 42, Orange500)
                    CostCenterItem("方便菜事业部", "¥128,400", 15, Emerald500)
                    CostCenterItem("行政后勤部", "¥62,100", 8, Slate400)
                }
            }
        }
    }
}

@Composable
fun CostCenterItem(label: String, amount: String, percent: Int, color: Color) {
    Column(Modifier.padding(vertical = 8.dp)) {
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
            Text(label, fontSize = 12.sp, color = Slate700)
            Text(amount, fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Slate900)
        }
        Spacer(Modifier.height(8.dp))
        Box(Modifier.fillMaxWidth().height(8.dp).background(Slate50, RoundedCornerShape(4.dp))) {
            Box(Modifier.fillMaxWidth(percent / 100f).fillMaxHeight().background(color, RoundedCornerShape(4.dp)))
        }
    }
}

@Composable
fun PositionCostScreen() {
    LazyColumn(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Text("核心职位人效与成本对比", fontWeight = FontWeight.Bold, fontSize = 14.sp)
        }
        
        items(listOf("主厨", "洗消员", "切配员", "配送司机", "分餐员")) { position ->
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = Color.White)
            ) {
                Row(Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                    Column(Modifier.weight(1f)) {
                        Text(position, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        Text("平均时薪: ¥35.5 | 人均产出: ¥128/h", color = Slate500, fontSize = 11.sp)
                    }
                    Column(horizontalAlignment = Alignment.End) {
                        Text("成本占比", color = Slate500, fontSize = 10.sp)
                        Text("12.4%", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = Blue500)
                    }
                }
            }
        }
    }
}
