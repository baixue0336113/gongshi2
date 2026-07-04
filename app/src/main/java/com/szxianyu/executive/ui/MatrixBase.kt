package com.szxianyu.executive.ui

import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ChevronLeft
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.szxianyu.executive.ui.theme.*

@Composable
fun MatrixBase(
    title: String,
    days: List<String>,
    rows: List<MatrixRowData>,
    kbiSummary: List<Triple<String, String, Color>> = emptyList(),
    onMonthChange: (String) -> Unit
) {
    var selectedMonth by remember { mutableStateOf("2026-07") }
    val horizontalScrollState = rememberScrollState()

    Column(modifier = Modifier.fillMaxSize()) {
        // Month Selector & KBI Header
        Card(
            modifier = Modifier.fillMaxWidth().padding(bottom = 16.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            shape = RoundedCornerShape(12.dp)
        ) {
            Column(Modifier.padding(16.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(title, fontWeight = FontWeight.Bold, fontSize = 16.sp, color = Slate900)
                    
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        IconButton(onClick = { /* Previous month */ }) {
                            Icon(Icons.Default.ChevronLeft, contentDescription = null)
                        }
                        Text(selectedMonth, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        IconButton(onClick = { /* Next month */ }) {
                            Icon(Icons.Default.ChevronRight, contentDescription = null)
                        }
                    }
                }

                if (kbiSummary.isNotEmpty()) {
                    Spacer(Modifier.height(16.dp))
                    Row(horizontalArrangement = Arrangement.spacedBy(24.dp)) {
                        kbiSummary.forEach { (label, value, color) ->
                            Column {
                                Text(label, color = Slate500, fontSize = 11.sp)
                                Text(value, color = color, fontSize = 18.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
            }
        }

        // The Matrix Table
        Card(
            modifier = Modifier.weight(1f),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            shape = RoundedCornerShape(12.dp),
            border = BorderStroke(1.dp, Slate200)
        ) {
            Column {
                // Table Header
                Row(modifier = Modifier.fillMaxWidth().background(Slate50).horizontalScroll(horizontalScrollState)) {
                    Box(Modifier.width(160.dp).padding(12.dp).background(Slate50)) {
                        Text("部门名称", fontWeight = FontWeight.Bold, fontSize = 12.sp, color = Slate600)
                    }
                    Box(Modifier.width(80.dp).padding(12.dp).background(Slate50)) {
                        Text("月度合计", fontWeight = FontWeight.Bold, fontSize = 12.sp, textAlign = TextAlign.Center, color = Slate600)
                    }
                    days.forEach { day ->
                        Box(Modifier.width(44.dp).padding(vertical = 12.dp), contentAlignment = Alignment.Center) {
                            Text(day, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Slate500)
                        }
                    }
                }

                Divider(color = Slate200)

                // Table Rows
                LazyColumn(modifier = Modifier.fillMaxSize()) {
                    items(rows) { row ->
                        MatrixRow(row, horizontalScrollState, days)
                        Divider(color = Slate100)
                    }
                }
            }
        }
    }
}

@Composable
fun MatrixRow(
    row: MatrixRowData,
    scrollState: ScrollState,
    days: List<String>
) {
    Row(modifier = Modifier.fillMaxWidth().horizontalScroll(scrollState)) {
        // Sticky-ish columns (simulated with fixed width in horizontal scroll)
        Box(Modifier.width(160.dp).padding(12.dp)) {
            Text(row.name, fontSize = 12.sp, color = Slate900, fontWeight = if (row.isHeader) FontWeight.Bold else FontWeight.Normal)
        }
        Box(Modifier.width(80.dp).padding(12.dp), contentAlignment = Alignment.Center) {
            Text(row.total, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Slate900)
        }
        
        days.forEach { day ->
            val cell = row.daily[day]
            Box(
                modifier = Modifier
                    .width(44.dp)
                    .height(48.dp)
                    .background(if (cell?.isAbnormal == true) Color(0xFFFEF2F2) else Color.Transparent)
                    .border(0.2.dp, Slate100),
                contentAlignment = Alignment.Center
            ) {
                if (cell != null) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            cell.value,
                            fontSize = 10.sp,
                            color = if (cell.isAbnormal) Rose500 else Slate600,
                            fontWeight = if (cell.isAbnormal) FontWeight.Bold else FontWeight.Normal
                        )
                        if (cell.subValue != null) {
                            Text(cell.subValue, fontSize = 7.sp, color = Slate400)
                        }
                    }
                }
            }
        }
    }
}

data class MatrixRowData(
    val id: String,
    val name: String,
    val total: String,
    val isHeader: Boolean = false,
    val daily: Map<String, MatrixCellData> = emptyMap()
)

data class MatrixCellData(
    val value: String,
    val subValue: String? = null,
    val isAbnormal: Boolean = false
)
