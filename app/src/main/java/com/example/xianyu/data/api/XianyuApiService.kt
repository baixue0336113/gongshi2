package com.example.xianyu.data.api

import com.example.xianyu.data.models.DashboardResponse
import retrofit2.Response
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.POST
import retrofit2.http.Query

interface XianyuApiService {
    @POST("/api/platform/auth/login")
    suspend fun login(@retrofit2.http.Body credentials: Map<String, String>): Response<Map<String, String>>

    @GET("/api/plugins/hr/executive-dashboard")
    suspend fun getDashboard(
        @Header("Authorization") token: String,
        @Query("review_date") date: String
    ): Response<DashboardResponse>

    @GET("/api/plugins/hr/monthly-check/baimao")
    suspend fun getBaimaoData(
        @Header("Authorization") token: String,
        @Query("month") month: String
    ): Response<Map<String, Any>>
}
