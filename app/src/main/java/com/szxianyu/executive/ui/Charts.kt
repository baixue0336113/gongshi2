package com.szxianyu.executive.ui

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.*
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.szxianyu.executive.ui.theme.*
import kotlin.math.cos
import kotlin.math.sin

// --- Data Models for Charts ---

data class ChartPoint(
    val label: String,
    val value1: Float, // Primary value (e.g. work hours)
    val value2: Float? = null // Secondary value (e.g. health score)
)

data class BarPoint(
    val label: String,
    val value: Float,
    val totalHours: Float? = null,
    val headcount: Int? = null
)

data class PieSlice(
    val name: String,
    val value: Float,
    val color: Color
)

data class RadarDimension(
    val label: String,
    val value: Float,
    val maxVal: Float = 100f
)

// --- 1. Custom Area Trend Chart (Dual-Axis support) ---

@Composable
fun CustomAreaChart(
    points: List<ChartPoint>,
    modifier: Modifier = Modifier,
    color1: Color = Orange500,
    color2: Color = Emerald500,
    title1: String = "生产工时 (h)",
    title2: String? = "对账健康度 (分)",
    showAverageLine: Boolean = false
) {
    if (points.isEmpty()) return

    val maxVal1 = points.maxOf { it.value1 }.let { if (it == 0f) 100f else it * 1.15f }
    val hasSecondary = points.any { it.value2 != null }
    val minVal2 = 70f
    val maxVal2 = 100f

    Column(modifier = modifier) {
        // Legend Header
        Row(
            modifier = Modifier.fillMaxWidth().padding(horizontal = 4.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(Modifier.size(10.dp).background(color1, CircleShape))
                Spacer(Modifier.width(6.dp))
                Text(title1, fontSize = 10.sp, color = Slate600, fontWeight = FontWeight.Bold)
            }
            if (hasSecondary && title2 != null) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(Modifier.size(10.dp).background(color2, CircleShape))
                    Spacer(Modifier.width(6.dp))
                    Text(title2, fontSize = 10.sp, color = Slate600, fontWeight = FontWeight.Bold)
                }
            }
        }

        Spacer(Modifier.height(8.dp))

        // Main Drawing Canvas
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f)
        ) {
            Canvas(modifier = Modifier.fillMaxSize()) {
                val width = size.width
                val height = size.height

                val paddingLeft = 40f
                val paddingRight = if (hasSecondary) 40f else 20f
                val paddingTop = 15f
                val paddingBottom = 20f

                val chartWidth = width - paddingLeft - paddingRight
                val chartHeight = height - paddingTop - paddingBottom

                // Grid Lines
                val gridLines = 4
                for (i in 0..gridLines) {
                    val y = paddingTop + (chartHeight * i / gridLines)
                    drawLine(
                        color = Slate200,
                        start = Offset(paddingLeft, y),
                        end = Offset(width - paddingRight, y),
                        strokeWidth = 1f,
                        pathEffect = PathEffect.dashPathEffect(floatArrayOf(10f, 10f), 0f)
                    )
                }

                // Plot Area 1 (Primary Y-axis)
                val stepX = if (points.size > 1) chartWidth / (points.size - 1) else chartWidth
                val path1 = Path()
                val areaPath = Path()

                points.forEachIndexed { index, point ->
                    val x = paddingLeft + (index * stepX)
                    val y = paddingTop + chartHeight * (1f - (point.value1 / maxVal1))

                    if (index == 0) {
                        path1.moveTo(x, y)
                        areaPath.moveTo(x, paddingTop + chartHeight)
                        areaPath.lineTo(x, y)
                    } else {
                        path1.lineTo(x, y)
                        areaPath.lineTo(x, y)
                    }

                    if (index == points.size - 1) {
                        areaPath.lineTo(x, paddingTop + chartHeight)
                        areaPath.close()
                    }
                }

                // Draw Gradient Area 1
                drawPath(
                    path = areaPath,
                    brush = Brush.verticalGradient(
                        colors = listOf(color1.copy(alpha = 0.2f), Color.Transparent),
                        startY = paddingTop,
                        endY = paddingTop + chartHeight
                    )
                )

                // Draw Line 1
                drawPath(
                    path = path1,
                    color = color1,
                    style = Stroke(width = 4f, cap = StrokeCap.Round)
                )

                // Draw Dots 1
                points.forEachIndexed { index, point ->
                    val x = paddingLeft + (index * stepX)
                    val y = paddingTop + chartHeight * (1f - (point.value1 / maxVal1))
                    drawCircle(
                        color = color1,
                        radius = 8f,
                        center = Offset(x, y)
                    )
                    drawCircle(
                        color = Color.White,
                        radius = 4f,
                        center = Offset(x, y)
                    )
                }

                // Draw Average Line 1
                if (showAverageLine && points.isNotEmpty()) {
                    val avgVal1 = points.map { it.value1 }.average().toFloat()
                    val avgY = paddingTop + chartHeight * (1f - (avgVal1 / maxVal1))
                    drawLine(
                        color = color1.copy(alpha = 0.5f),
                        start = Offset(paddingLeft, avgY),
                        end = Offset(width - paddingRight, avgY),
                        strokeWidth = 2f,
                        pathEffect = PathEffect.dashPathEffect(floatArrayOf(10f, 10f), 0f)
                    )
                }

                // Plot Line 2 (Secondary Y-axis)
                if (hasSecondary) {
                    val path2 = Path()
                    points.forEachIndexed { index, point ->
                        val val2 = point.value2 ?: 100f
                        val ratio = (val2 - minVal2) / (maxVal2 - minVal2)
                        val x = paddingLeft + (index * stepX)
                        val y = paddingTop + chartHeight * (1f - ratio.coerceIn(0f, 1f))

                        if (index == 0) {
                            path2.moveTo(x, y)
                        } else {
                            path2.lineTo(x, y)
                        }
                    }

                    // Draw Line 2
                    drawPath(
                        path = path2,
                        color = color2,
                        style = Stroke(width = 4f, cap = StrokeCap.Round)
                    )

                    // Draw Dots 2
                    points.forEachIndexed { index, point ->
                        val val2 = point.value2 ?: 100f
                        val ratio = (val2 - minVal2) / (maxVal2 - minVal2)
                        val x = paddingLeft + (index * stepX)
                        val y = paddingTop + chartHeight * (1f - ratio.coerceIn(0f, 1f))
                        drawCircle(
                            color = color2,
                            radius = 8f,
                            center = Offset(x, y)
                        )
                        drawCircle(
                            color = Color.White,
                            radius = 4f,
                            center = Offset(x, y)
                        )
                    }
                }
            }
        }

        // X-axis Labels Row
        Row(
            modifier = Modifier.fillMaxWidth().padding(start = 30.dp, end = if (hasSecondary) 30.dp else 10.dp),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            points.forEach { point ->
                Text(
                    text = point.label,
                    fontSize = 8.sp,
                    color = Slate400,
                    fontWeight = FontWeight.Bold,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.width(36.dp)
                )
            }
        }
    }
}

// --- 2. Custom Vertical Bar Chart ---

@Composable
fun CustomBarChart(
    bars: List<BarPoint>,
    modifier: Modifier = Modifier,
    barColor: Color = Blue500
) {
    if (bars.isEmpty()) return

    val maxVal = bars.maxOf { it.value }.let { if (it == 0f) 10f else it }

    Column(modifier = modifier) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f)
                .padding(bottom = 8.dp),
            horizontalArrangement = Arrangement.SpaceEvenly,
            verticalAlignment = Alignment.Bottom
        ) {
            bars.forEach { bar ->
                val progress = bar.value / maxVal
                val animatedHeight by animateFloatAsState(targetValue = progress)

                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    modifier = Modifier.weight(1f)
                ) {
                    Text(
                        text = "${bar.value}h",
                        fontSize = 8.sp,
                        fontWeight = FontWeight.Bold,
                        color = Slate600,
                        modifier = Modifier.padding(bottom = 4.dp)
                    )

                    Box(
                        modifier = Modifier
                            .width(18.dp)
                            .fillMaxHeight(animatedHeight.coerceIn(0.05f, 1f))
                            .background(
                                brush = Brush.verticalGradient(
                                    colors = listOf(barColor, barColor.copy(alpha = 0.6f))
                                ),
                                shape = RoundedCornerShape(topStart = 4.dp, topEnd = 4.dp)
                            )
                    )
                }
            }
        }

        // Horizontal bottom labels
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceEvenly
        ) {
            bars.forEach { bar ->
                Text(
                    text = bar.label,
                    fontSize = 7.5.sp,
                    fontWeight = FontWeight.Medium,
                    color = Slate500,
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.weight(1f)
                )
            }
        }
    }
}

// --- 3. Custom Donut/Pie Chart ---

@Composable
fun CustomPieChart(
    slices: List<PieSlice>,
    modifier: Modifier = Modifier
) {
    val total = slices.sumOf { it.value.toDouble() }.toFloat().let { if (it == 0f) 1f else it }

    Row(
        modifier = modifier,
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // Pie Canvas (Left side)
        Box(
            modifier = Modifier
                .size(110.dp)
                .aspectRatio(1f),
            contentAlignment = Alignment.Center
        ) {
            Canvas(modifier = Modifier.fillMaxSize()) {
                var startAngle = -90f
                slices.forEach { slice ->
                    val sweepAngle = (slice.value / total) * 360f
                    drawArc(
                        color = slice.color,
                        startAngle = startAngle,
                        sweepAngle = sweepAngle,
                        useCenter = false,
                        style = Stroke(width = 24f, cap = StrokeCap.Round)
                    )
                    startAngle += sweepAngle
                }
            }

            // Center Ring Text
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text("占比", fontSize = 9.sp, color = Slate400, fontWeight = FontWeight.Bold)
                Text("100%", fontSize = 12.sp, fontWeight = FontWeight.Black, color = Slate800)
            }
        }

        // Legend details (Right side)
        Column(
            modifier = Modifier.weight(1f),
            verticalArrangement = Arrangement.spacedBy(4.dp)
        ) {
            slices.take(5).forEach { slice ->
                val percentage = (slice.value / total) * 100f
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Box(
                        Modifier
                            .size(8.dp)
                            .background(slice.color, RoundedCornerShape(2.dp))
                    )
                    Spacer(Modifier.width(6.dp))
                    Text(
                        text = slice.name,
                        fontSize = 10.sp,
                        color = Slate600,
                        modifier = Modifier.weight(1.5f),
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                    Text(
                        text = String.format("%.1f%%", percentage),
                        fontSize = 9.5.sp,
                        fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace,
                        fontWeight = FontWeight.Bold,
                        color = Slate800,
                        modifier = Modifier.weight(1f),
                        textAlign = TextAlign.End
                    )
                }
            }
        }
    }
}

// --- 4. Custom Radar Chart ---

@Composable
fun CustomRadarChart(
    dimensions: List<RadarDimension>,
    modifier: Modifier = Modifier,
    radarColor: Color = Orange500
) {
    if (dimensions.isEmpty()) return

    Box(
        modifier = modifier,
        contentAlignment = Alignment.Center
    ) {
        Canvas(modifier = Modifier.fillMaxSize()) {
            val center = Offset(size.width / 2f, size.height / 2f)
            val radius = minOf(size.width, size.height) * 0.38f
            val numPoints = dimensions.size
            val angleStep = 360f / numPoints

            // Draw 3 layers of Concentric Polygons
            val polygonLayers = listOf(0.33f, 0.66f, 1f)
            polygonLayers.forEach { scale ->
                val path = Path()
                for (i in 0 until numPoints) {
                    val angleInRad = Math.toRadians((i * angleStep - 90f).toDouble())
                    val x = center.x + radius * scale * cos(angleInRad).toFloat()
                    val y = center.y + radius * scale * sin(angleInRad).toFloat()

                    if (i == 0) path.moveTo(x, y) else path.lineTo(x, y)
                }
                path.close()
                drawPath(path, color = Slate200, style = Stroke(width = 1.5f))
            }

            // Draw Spokes/Lines extending from center
            for (i in 0 until numPoints) {
                val angleInRad = Math.toRadians((i * angleStep - 90f).toDouble())
                val x = center.x + radius * cos(angleInRad).toFloat()
                val y = center.y + radius * sin(angleInRad).toFloat()
                drawLine(
                    color = Slate200,
                    start = center,
                    end = Offset(x, y),
                    strokeWidth = 1.5f
                )
            }

            // Draw data Radar Area
            val dataPath = Path()
            for (i in 0 until numPoints) {
                val dim = dimensions[i]
                val pct = (dim.value / dim.maxVal).coerceIn(0f, 1f)
                val angleInRad = Math.toRadians((i * angleStep - 90f).toDouble())
                val x = center.x + radius * pct * cos(angleInRad).toFloat()
                val y = center.y + radius * pct * sin(angleInRad).toFloat()

                if (i == 0) dataPath.moveTo(x, y) else dataPath.lineTo(x, y)
            }
            dataPath.close()

            // Fill Radar Polygon
            drawPath(
                path = dataPath,
                color = radarColor.copy(alpha = 0.22f)
            )
            // Stroke Radar Polygon
            drawPath(
                path = dataPath,
                color = radarColor,
                style = Stroke(width = 4f, cap = StrokeCap.Round)
            )

            // Draw Dots on Radar Data Points
            for (i in 0 until numPoints) {
                val dim = dimensions[i]
                val pct = (dim.value / dim.maxVal).coerceIn(0f, 1f)
                val angleInRad = Math.toRadians((i * angleStep - 90f).toDouble())
                val x = center.x + radius * pct * cos(angleInRad).toFloat()
                val y = center.y + radius * pct * sin(angleInRad).toFloat()

                drawCircle(color = radarColor, radius = 5f, center = Offset(x, y))
                drawCircle(color = Color.White, radius = 2.5f, center = Offset(x, y))
            }
        }

        // Placing text labels absolutely around the radar
        val numPoints = dimensions.size
        val angleStep = 360f / numPoints
        val textDist = 58.dp // Slightly larger than radius (0.38 of min size)
        
        dimensions.forEachIndexed { i, dim ->
            val angleInRad = Math.toRadians((i * angleStep - 90f).toDouble())
            val xOffset = textDist.value * cos(angleInRad).toFloat()
            val yOffset = textDist.value * sin(angleInRad).toFloat()

            Box(
                modifier = Modifier
                    .offset(x = xOffset.dp, y = yOffset.dp),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(
                        text = dim.label,
                        fontSize = 8.5.sp,
                        fontWeight = FontWeight.Bold,
                        color = Slate600,
                        textAlign = TextAlign.Center
                    )
                    Text(
                        text = "${dim.value.toInt()}%",
                        fontSize = 8.sp,
                        fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace,
                        fontWeight = FontWeight.ExtraBold,
                        color = radarColor,
                        textAlign = TextAlign.Center
                    )
                }
            }
        }
    }
}

// --- 5. Custom Quadrant Scatter Chart ---

data class ScatterPoint(
    val x: Float, // Frequency or average hours (7.0 to 11.5)
    val y: Float, // Score/Severity (0 to 100)
    val label: String,
    val color: Color
)

@Composable
fun CustomScatterChart(
    points: List<ScatterPoint>,
    modifier: Modifier = Modifier
) {
    if (points.isEmpty()) return

    val minX = 7.0f
    val maxX = 11.5f
    val minY = 0f
    val maxY = 100f

    Column(modifier = modifier) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f)
        ) {
            Canvas(modifier = Modifier.fillMaxSize()) {
                val width = size.width
                val height = size.height

                val paddingLeft = 40f
                val paddingRight = 20f
                val paddingTop = 15f
                val paddingBottom = 20f

                val chartWidth = width - paddingLeft - paddingRight
                val chartHeight = height - paddingTop - paddingBottom

                // Draw 2x2 background Quadrants
                val halfW = chartWidth / 2f
                val halfH = chartHeight / 2f

                // Bottom-left: Emerald (low severity, low hours)
                drawRect(
                    color = Color(0xFFECFDF5).copy(alpha = 0.6f),
                    topLeft = Offset(paddingLeft, paddingTop + halfH),
                    size = Size(halfW, halfH)
                )
                // Bottom-right: Amber (low severity, high hours)
                drawRect(
                    color = Color(0xFFFFFBEB).copy(alpha = 0.6f),
                    topLeft = Offset(paddingLeft + halfW, paddingTop + halfH),
                    size = Size(halfW, halfH)
                )
                // Top-left: Amber (high severity, low hours)
                drawRect(
                    color = Color(0xFFFFFBEB).copy(alpha = 0.6f),
                    topLeft = Offset(paddingLeft, paddingTop),
                    size = Size(halfW, halfH)
                )
                // Top-right: Rose (high severity, high hours)
                drawRect(
                    color = Color(0xFFFEF2F2).copy(alpha = 0.6f),
                    topLeft = Offset(paddingLeft + halfW, paddingTop),
                    size = Size(halfW, halfH)
                )

                // Draw Center Axes/Lines of Quadrants
                drawLine(
                    color = Slate300,
                    start = Offset(paddingLeft + halfW, paddingTop),
                    end = Offset(paddingLeft + halfW, paddingTop + chartHeight),
                    strokeWidth = 2f
                )
                drawLine(
                    color = Slate300,
                    start = Offset(paddingLeft, paddingTop + halfH),
                    end = Offset(paddingLeft + chartWidth, paddingTop + halfH),
                    strokeWidth = 2f
                )

                // Draw Outer Frame Box
                drawRect(
                    color = Slate200,
                    topLeft = Offset(paddingLeft, paddingTop),
                    size = Size(chartWidth, chartHeight),
                    style = Stroke(width = 2f)
                )

                // Plot Scatter points
                points.forEach { pt ->
                    val ratioX = ((pt.x - minX) / (maxX - minX)).coerceIn(0f, 1f)
                    val ratioY = (1f - (pt.y - minY) / (maxY - minY)).coerceIn(0f, 1f)

                    val px = paddingLeft + chartWidth * ratioX
                    val py = paddingTop + chartHeight * ratioY

                    // Draw shadow ring around the dot
                    drawCircle(
                        color = pt.color.copy(alpha = 0.3f),
                        radius = 12f,
                        center = Offset(px, py)
                    )
                    // Draw core dot
                    drawCircle(
                        color = pt.color,
                        radius = 7f,
                        center = Offset(px, py)
                    )
                    // White inner center
                    drawCircle(
                        color = Color.White,
                        radius = 3f,
                        center = Offset(px, py)
                    )
                }
            }
        }
    }
}
