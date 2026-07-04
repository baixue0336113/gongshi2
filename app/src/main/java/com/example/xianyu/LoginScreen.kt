package com.example.xianyu

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.VisibilityOff
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.xianyu.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LoginScreen(onLoginSuccess: (String, String) -> Unit) {
    var username by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var showPassword by remember { mutableStateOf(false) }
    var loading by remember { mutableStateOf(false) }
    var error by remember { mutableStateOf<String?>(null) }

    Row(modifier = Modifier.fillMaxSize()) {
        // Left Panel (Aesthetic Branding) - Visible on tablets/foldables
        Box(
            modifier = Modifier
                .weight(1f)
                .fillMaxHeight()
                .background(
                    brush = Brush.verticalGradient(
                        colors = listOf(Slate900, Slate950)
                    )
                )
                .padding(48.dp)
        ) {
            Column(modifier = Modifier.fillMaxSize()) {
                // Logo
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Card(
                        modifier = Modifier.size(40.dp),
                        shape = RoundedCornerShape(12.dp),
                        colors = CardDefaults.cardColors(containerColor = Orange500)
                    ) {
                        Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                            Text("鲜", color = Slate950, fontWeight = FontWeight.Bold, fontSize = 20.sp)
                        }
                    }
                    Spacer(Modifier.width(12.dp))
                    Column {
                        Text("鲜誉集团经营舱", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                        Text("EXECUTIVE COCKPIT", color = Orange400, fontSize = 10.sp, letterSpacing = 2.sp)
                    }
                }

                Spacer(Modifier.weight(1f))

                // Slogan
                Surface(
                    color = Slate800,
                    shape = RoundedCornerShape(20.dp),
                    modifier = Modifier.padding(bottom = 16.dp)
                ) {
                    Text(
                        "V2 Purity Platform",
                        color = Slate300,
                        fontSize = 10.sp,
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
                    )
                }
                Text(
                    "数据驱动经营\n精细穿透管理",
                    color = Color.White,
                    fontSize = 32.sp,
                    fontWeight = FontWeight.Bold,
                    lineHeight = 42.sp
                )
                Text(
                    "集成工时、学生餐成本、职位效能、劳务派遣及风险管控等核心指标。为决策层提供秒级穿透的正式级经营报表与分析驾驶舱。",
                    color = Slate400,
                    fontSize = 14.sp,
                    modifier = Modifier.padding(top = 16.dp).width(360.dp)
                )

                Spacer(Modifier.weight(1f))

                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text("安全凭证受 SSL / SHA256 强加密保护", color = Slate600, fontSize = 12.sp)
                    Text("© 鲜誉科技 2026", color = Slate600, fontSize = 12.sp)
                }
            }
        }

        // Right Panel (Login Form)
        Box(
            modifier = Modifier
                .weight(1f)
                .fillMaxHeight()
                .background(Slate950),
            contentAlignment = Alignment.Center
        ) {
            Column(
                modifier = Modifier
                    .width(400.dp)
                    .padding(32.dp)
            ) {
                Text("管理员登录", color = Color.White, fontSize = 24.sp, fontWeight = FontWeight.Bold)
                Text("请输入您的 V2 纯净经营舱管理平台账号以开始审计", color = Slate400, fontSize = 12.sp, modifier = Modifier.padding(top = 4.dp))

                Spacer(Modifier.height(32.dp))

                // Username
                Text("用户名 / 手机号", color = Slate300, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                OutlinedTextField(
                    value = username,
                    onValueChange = { username = it },
                    modifier = Modifier.fillMaxWidth().padding(top = 6.dp),
                    placeholder = { Text("请输入您的安全账号", color = Slate500) },
                    leadingIcon = { Icon(Icons.Default.Person, contentDescription = null, tint = Slate500) },
                    shape = RoundedCornerShape(12.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = Orange500,
                        unfocusedBorderColor = Slate800,
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        containerColor = Slate900
                    ),
                    singleLine = true
                )

                Spacer(Modifier.height(20.dp))

                // Password
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text("安全登录密码", color = Slate300, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                    Text("忘记密码？", color = Orange400, fontSize = 10.sp)
                }
                OutlinedTextField(
                    value = password,
                    onValueChange = { password = it },
                    modifier = Modifier.fillMaxWidth().padding(top = 6.dp),
                    placeholder = { Text("请输入您的安全密码", color = Slate500) },
                    leadingIcon = { Icon(Icons.Default.Lock, contentDescription = null, tint = Slate500) },
                    trailingIcon = {
                        IconButton(onClick = { showPassword = !showPassword }) {
                            Icon(
                                if (showPassword) Icons.Default.VisibilityOff else Icons.Default.Visibility,
                                contentDescription = null,
                                tint = Slate500
                            )
                        }
                    },
                    shape = RoundedCornerShape(12.dp),
                    visualTransformation = if (showPassword) VisualTransformation.None else PasswordVisualTransformation(),
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = Orange500,
                        unfocusedBorderColor = Slate800,
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        containerColor = Slate900
                    ),
                    singleLine = true
                )

                if (error != null) {
                    Spacer(Modifier.height(16.dp))
                    Text(error!!, color = Rose500, fontSize = 12.sp)
                }

                Spacer(Modifier.height(24.dp))

                Button(
                    onClick = {
                        loading = true
                        // Simulate API call
                        if (username == "admin" && password == "admin123") {
                            onLoginSuccess("demo_token", username)
                        } else {
                            error = "登录失败，用户名或密码错误"
                        }
                        loading = false
                    },
                    modifier = Modifier.fillMaxWidth().height(52.dp),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Orange500),
                    enabled = !loading
                ) {
                    if (loading) {
                        CircularProgressIndicator(modifier = Modifier.size(24.dp), color = Slate950)
                    } else {
                        Text("登 录 经 营 舱", color = Slate950, fontWeight = FontWeight.Bold)
                    }
                }

                Spacer(Modifier.height(32.dp))
                Column(modifier = Modifier.fillMaxWidth(), horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("首次使用？请向集团 HR 数字化中心申请访问秘钥。", color = Slate500, fontSize = 11.sp)
                    Text("(演示环境可使用 admin / admin123 登录体验)", color = Slate600, fontSize = 10.sp, modifier = Modifier.padding(top = 4.dp))
                }
            }
        }
    }
}
