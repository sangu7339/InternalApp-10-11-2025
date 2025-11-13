//package com.VentureBiz.VenureBiz_Hr.repository;
//
//import com.VentureBiz.VenureBiz_Hr.model.Attendance;
//import com.VentureBiz.VenureBiz_Hr.model.User;
//import org.springframework.data.jpa.repository.JpaRepository;
//import org.springframework.data.jpa.repository.Query;
//import org.springframework.data.repository.query.Param;
//
//import java.time.LocalDate;
//import java.util.List;
//import java.util.Optional;
//
//public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
//
//    // Get attendance for a specific user on a specific date
//    Optional<Attendance> findByUserAndDate(User user, LocalDate date);
//
//    // Get all attendance for a user
//    List<Attendance> findByUser(User user);
//
//    // Get all attendance for a user in a specific month and year
//    @Query("SELECT a FROM Attendance a WHERE a.user = :user AND YEAR(a.date) = :year AND MONTH(a.date) = :month")
//    List<Attendance> findByUserAndMonth(@Param("user") User user,
//                                        @Param("year") int year,
//                                        @Param("month") int month);
//
//    // Get all attendance for all users in a specific month and year
//    @Query("SELECT a FROM Attendance a WHERE YEAR(a.date) = :year AND MONTH(a.date) = :month")
//    List<Attendance> findByMonth(@Param("year") int year,
//                                 @Param("month") int month);
//
//    // Count attendance records for a user with a specific status in a given month
//    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.user = :user AND a.status = :status " +
//           "AND YEAR(a.date) = :year AND MONTH(a.date) = :month")
//    long countByUserAndStatusAndMonth(@Param("user") User user,
//                                      @Param("status") String status,
//                                      @Param("year") int year,
//                                      @Param("month") int month);
//
//    // ✅ NEW: Get all attendance records for a specific date (used in scheduler)
//    List<Attendance> findByDate(LocalDate date);
//    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN TRUE ELSE FALSE END " +
//            "FROM Attendance a " +
//            "WHERE a.user = :user AND a.date = :date AND a.status = :status")
//     boolean existsByUserAndDateAndStatus(@Param("user") User user,
//                                          @Param("date") LocalDate date,
//                                          @Param("status") String status);
//    
//    
// }
//
// src/main/java/com/VentureBiz/VenureBiz_Hr/repository/AttendanceRepository.java
package com.VentureBiz.VenureBiz_Hr.repository;

import com.VentureBiz.VenureBiz_Hr.model.Attendance;
import com.VentureBiz.VenureBiz_Hr.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    Optional<Attendance> findByUserAndDate(User user, LocalDate date);

    List<Attendance> findByUser(User user);

    @Query("SELECT a FROM Attendance a WHERE a.user = :user AND YEAR(a.date) = :year AND MONTH(a.date) = :month")
    List<Attendance> findByUserAndMonth(@Param("user") User user,
                                        @Param("year") int year,
                                        @Param("month") int month);

    @Query("SELECT a FROM Attendance a WHERE YEAR(a.date) = :year AND MONTH(a.date) = :month")
    List<Attendance> findByMonth(@Param("year") int year,
                                 @Param("month") int month);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.user = :user AND a.status = :status " +
           "AND YEAR(a.date) = :year AND MONTH(a.date) = :month")
    long countByUserAndStatusAndMonth(@Param("user") User user,
                                      @Param("status") String status,
                                      @Param("year") int year,
                                      @Param("month") int month);

    // ✅ HALF_DAY counter
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.user = :user AND a.status = 'HALF_DAY' " +
           "AND YEAR(a.date) = :year AND MONTH(a.date) = :month")
    long countHalfDays(@Param("user") User user,
                       @Param("year") int year,
                       @Param("month") int month);

    List<Attendance> findByDate(LocalDate date);

    @Query("SELECT CASE WHEN COUNT(a) > 0 THEN TRUE ELSE FALSE END " +
            "FROM Attendance a " +
            "WHERE a.user = :user AND a.date = :date AND a.status = :status")
    boolean existsByUserAndDateAndStatus(@Param("user") User user,
                                         @Param("date") LocalDate date,
                                         @Param("status") String status);
    
    
    long countByDate(LocalDate date);

    // ✅ Count all ABSENT records for a specific date
    long countByDateAndStatus(LocalDate date, String status);
    
    
    @Query("SELECT COUNT(DISTINCT a.user.id) FROM Attendance a " +
    	       "WHERE a.date = :date AND a.user.id IN (" +
    	       "SELECT b.user.id FROM Attendance b WHERE b.date = :date AND b.status = 'ABSENT')")
    	long countEmployeesWithCheckinAndAbsentSameDay(@Param("date") LocalDate date);

}

