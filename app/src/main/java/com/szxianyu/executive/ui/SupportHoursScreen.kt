package com.szxianyu.executive.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Sync
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
fun SupportHoursScreen() {
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
                    Text("跨部门支援总览", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                    Spacer(Modifier.height(16.dp))
                    Row(horizontalArrangement = Arrangement.spacedBy(24.dp)) {
                        SupportStat("总支援工时", "420h", Blue500)
                        SupportStat("支援人数", "32人", Orange500)
                        SupportStat("结算金额", "¥12,600", Emerald500)
                    }
                }
            }
        }

        item {
            Text("实时支援动态", fontWeight = FontWeight.Bold, fontSize = 14.sp)
        }

        items(5) {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = Color.White)
            ) {
                Row(Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Default.Sync, contentDescription = null, tint = Blue500)
                    Spacer(Modifier.width(16.dp))
                    Column(Modifier.weight(1f)) {
                        Text("切配一组 -> 洗消二组", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                        Text("支援项目: 洗消高峰支援 | 2026-07-02", color = Slate500, fontSize = 11.sp)
                    }
                    Text("8.0h", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = Slate900)
                }
            }
        }
    }
}

@Composable
fun SupportStat(label: String, value: String, color: Color) {
    Column {
        Text(label, color = Slate500, fontSize = 11.sp)
        Text(value, color = color, fontSize = 18.sp, fontWeight = FontWeight.Bold)
    }
}
