package com.szxianyu.executive.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
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
fun EmployeePortraitScreen() {
    LazyColumn(
        modifier = Modifier.fillMaxSize().padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Profile Header
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                shape = RoundedCornerShape(16.dp)
            ) {
                Row(Modifier.padding(24.dp), verticalAlignment = Alignment.CenterVertically) {
                    Surface(
                        modifier = Modifier.size(80.dp),
                        shape = CircleShape,
                        color = Slate100
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Icon(Icons.Default.Person, contentDescription = null, modifier = Modifier.size(48.dp), tint = Slate400)
                        }
                    }
                    Spacer(Modifier.width(24.dp))
                    Column(Modifier.weight(1f)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text("张三", fontSize = 24.sp, fontWeight = FontWeight.Bold, color = Slate900)
                            Spacer(Modifier.width(12.dp))
                            Surface(color = Blue500, shape = RoundedCornerShape(4.dp)) {
                                Text("自有员工", color = Color.White, fontSize = 10.sp, modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp))
                            }
                        }
                        Text("工号: XY-00824 | 入职日期: 2023-05-12", color = Slate500, fontSize = 12.sp, modifier = Modifier.padding(top = 4.dp))
                        Text("所属部门: 学生餐二车间 - 切配组", color = Slate700, fontSize = 14.sp, modifier = Modifier.padding(top = 8.dp))
                    }
                    
                    Column(horizontalAlignment = Alignment.End) {
                        Text("本月效能评分", color = Slate500, fontSize = 11.sp)
                        Text("92.5", color = Orange500, fontSize = 32.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }

        // Stats Row
        item {
            Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                StatCard("出勤天数", "24天", "正常", Emerald500, Modifier.weight(1f))
                StatCard("累计工时", "192h", "超额", Orange500, Modifier.weight(1f))
                StatCard("异常打卡", "0次", "良好", Emerald500, Modifier.weight(1f))
                StatCard("加班时长", "12h", "注意", Orange500, Modifier.weight(1f))
            }
        }

        // Work History / Skills
        item {
            Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                Card(
                    modifier = Modifier.weight(1.5f),
                    colors = CardDefaults.cardColors(containerColor = Color.White)
                ) {
                    Column(Modifier.padding(16.dp)) {
                        Text("近期打卡记录 (穿透视窗)", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        Spacer(Modifier.height(16.dp))
                        (1..5).forEach {
                            Row(
                                modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text("2026-07-0$it", fontSize = 12.sp, color = Slate600)
                                Text("08:30 - 17:35", fontSize = 12.sp, color = Slate900)
                                Text("8.5h", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = Slate900)
                                Text("正常", fontSize = 12.sp, color = Emerald500)
                            }
                            Divider(color = Slate50)
                        }
                    }
                }

                Card(
                    modifier = Modifier.weight(1f),
                    colors = CardDefaults.cardColors(containerColor = Color.White)
                ) {
                    Column(Modifier.padding(16.dp)) {
                        Text("胜任力模型", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        Spacer(Modifier.height(16.dp))
                        SkillBar("切配效率", 0.95f)
                        SkillBar("安全意识", 0.88f)
                        SkillBar("团队协作", 0.92f)
                        SkillBar("稳定性", 0.98f)
                        SkillBar("技能广度", 0.75f)
                    }
                }
            }
        }
    }
}

@Composable
fun StatCard(label: String, value: String, status: String, color: Color, modifier: Modifier = Modifier) {
    Card(modifier, colors = CardDefaults.cardColors(containerColor = Color.White)) {
        Column(Modifier.padding(16.dp)) {
            Text(label, color = Slate500, fontSize = 11.sp)
            Spacer(Modifier.height(4.dp))
            Text(value, fontSize = 18.sp, fontWeight = FontWeight.Bold, color = Slate900)
            Spacer(Modifier.height(4.dp))
            Text(status, fontSize = 10.sp, color = color, fontWeight = FontWeight.Bold)
        }
    }
}

@Composable
fun SkillBar(label: String, progress: Float) {
    Column(Modifier.padding(vertical = 6.dp)) {
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
            Text(label, fontSize = 11.sp, color = Slate600)
            Text("${(progress * 100).toInt()}%", fontSize = 11.sp, fontWeight = FontWeight.Bold)
        }
        Spacer(Modifier.height(4.dp))
        Box(Modifier.fillMaxWidth().height(4.dp).background(Slate100, CircleShape)) {
            Box(Modifier.fillMaxWidth(progress).fillMaxHeight().background(Blue500, CircleShape))
        }
    }
}
