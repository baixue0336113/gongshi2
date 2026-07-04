package com.szxianyu.executive.data.api

import com.szxianyu.executive.data.models.DashboardResponse
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.POST
import retrofit2.http.Query

interface XianyuApiService {
    @POST("/api/platform/auth/login")
    suspend fun login(@Body credentials: Map<String, String>): Response<Map<String, String>>

    @GET("/api/plugins/hr/executive-dashboard")
    suspend fun getDashboard(
        @Header("Authorization") token: String,
        @Query("review_date") date: String
    ): Response<DashboardResponse>

    // Monthly Matrices
    @GET("/api/plugins/hr/monthly-check/work-matrix")
    suspend fun getWorkMatrix(
        @Header("Authorization") token: String,
        @Query("month") month: String
    ): Response<MatrixData>

    @GET("/api/plugins/hr/monthly-check/total-cost")
    suspend fun getTotalCostMatrix(
        @Header("Authorization") token: String,
        @Query("month") month: String
    ): Response<MatrixData>

    @GET("/api/plugins/hr/monthly-check/student-meal")
    suspend fun getStudentMealCost(
        @Header("Authorization") token: String,
        @Query("month") month: String
    ): Response<MatrixData>

    @GET("/api/plugins/hr/monthly-check/baimao")
    suspend fun getBaimaoData(
        @Header("Authorization") token: String,
        @Query("month") month: String
    ): Response<MatrixData>

    @GET("/api/plugins/hr/monthly-check/campus-part-time")
    suspend fun getCampusData(
        @Header("Authorization") token: String,
        @Query("month") month: String
    ): Response<MatrixData>

    @GET("/api/plugins/hr/monthly-check/convenience")
    suspend fun getConvenienceData(
        @Header("Authorization") token: String,
        @Query("month") month: String
    ): Response<MatrixData>

    @GET("/api/plugins/hr/monthly-check/third-party")
    suspend fun getThirdPartyData(
        @Header("Authorization") token: String,
        @Query("month") month: String
    ): Response<MatrixData>

    // Detail Screens
    @GET("/api/plugins/hr/department-penetration")
    suspend fun getDepartmentDetail(
        @Header("Authorization") token: String,
        @Query("dept_id") deptId: String,
        @Query("date") date: String
    ): Response<Map<String, Any>>

    @GET("/api/plugins/hr/employee-portrait")
    suspend fun getEmployeePortrait(
        @Header("Authorization") token: String,
        @Query("emp_id") empId: String
    ): Response<Map<String, Any>>
}
