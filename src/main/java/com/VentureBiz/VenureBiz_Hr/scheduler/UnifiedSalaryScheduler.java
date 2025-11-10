////////package com.VentureBiz.VenureBiz_Hr.scheduler;
////////
////////import com.VentureBiz.VenureBiz_Hr.model.Employee;
////////import com.VentureBiz.VenureBiz_Hr.model.MonthlySalary;
////////import com.VentureBiz.VenureBiz_Hr.model.SalaryPackage;
////////import com.VentureBiz.VenureBiz_Hr.repository.*;
////////import lombok.RequiredArgsConstructor;
////////import lombok.extern.slf4j.Slf4j;
////////import org.springframework.scheduling.annotation.Scheduled;
////////import org.springframework.stereotype.Component;
////////
////////import java.time.DayOfWeek;
////////import java.time.LocalDate;
////////import java.time.YearMonth;
////////import java.util.List;
////////
////////@Slf4j
////////@Component
////////@RequiredArgsConstructor
////////public class UnifiedSalaryScheduler {
////////
////////    private final MonthlySalaryRepository monthlySalaryRepository;
////////    private final SalaryPackageRepository salaryPackageRepository;
////////    private final EmployeeRepository employeeRepository;
////////    private final AttendanceRepository attendanceRepository;
////////    private final LeaveRepository leaveRepository;
////////
////////    /**
////////     * Runs once daily at 12:10 AM
////////     * Handles:
////////     * 1. Marking last month's salaries as PAID
////////     * 2. Creating current month salaries if missing
////////     * 3. Recalculating current month salaries based on attendance, leave & LOP
////////     */
////////    @Scheduled(cron = "0 10 0 * * *")
////////    public void processSalaries() {
////////        LocalDate today = LocalDate.now();
////////        YearMonth currentMonth = YearMonth.from(today);
////////        YearMonth previousMonth = currentMonth.minusMonths(1);
////////
////////        log.info("💼 Salary processing started for {}", currentMonth);
////////
////////        // 1️⃣ Mark previous month salaries as PAID
////////        monthlySalaryRepository.findByMonth(previousMonth).forEach(ms -> {
////////            if (ms.getStatus() != MonthlySalary.Status.PAID) {
////////                ms.setStatus(MonthlySalary.Status.PAID);
////////                monthlySalaryRepository.save(ms);
////////                log.info("✅ Marked salary as PAID for {} ({})", ms.getEmployee().getName(), previousMonth);
////////            }
////////        });
////////
////////        // 2️⃣ Process current month salaries
////////        List<Employee> employees = employeeRepository.findAll();
////////        int workingDays = getWorkingDaysInMonth(currentMonth);
////////
////////        for (Employee emp : employees) {
////////            MonthlySalary ms = monthlySalaryRepository
////////                    .findByEmployeeAndMonth(emp, currentMonth)
////////                    .orElseGet(() -> createNewMonthlySalary(emp, currentMonth, workingDays));
////////
////////            // Count attendance & approved sick leaves
////////            long presentDays = attendanceRepository.countByUserAndStatusAndMonth(
////////                    emp.getUser(), "PRESENT", currentMonth.getYear(), currentMonth.getMonthValue());
////////            long sickLeaves = leaveRepository.countApprovedSickLeaves(
////////                    emp.getUser(), currentMonth.getYear(), currentMonth.getMonthValue());
////////
////////            // 🧾 Calculate payable days (considering LOP)
////////            SalaryPackage sp = salaryPackageRepository.findByEmployee(emp)
////////                    .orElseThrow(() -> new RuntimeException("Salary package not found for " + emp.getName()));
////////
////////            long lopDays = sp.getLop() != 0 ? Math.round(sp.getLop()) : 0; // ✅ fixed: safe cast from double → long
////////            long payableDays = Math.max(0, presentDays + sickLeaves - lopDays);
////////            double factor = (double) payableDays / workingDays;
////////
////////            // Salary calculation
////////            double basic = sp.getBasic() / 12 * factor;
////////            double flexible = sp.getFlexibleBenefitPlan() / 12 * factor;
////////            double special = sp.getSpecialAllowance() / 12 * factor;
////////            double pf = sp.getPfContributionEmployer() / 12 * factor;
////////            double tax = sp.getProfessionalTax() / 12 * factor;
////////            double gross = basic + flexible + special + pf;
////////            double net = gross - tax;
////////
////////            // Update record
////////            ms.setBasic(basic);
////////            ms.setFlexibleBenefitPlan(flexible);
////////            ms.setSpecialAllowance(special);
////////            ms.setPfContributionEmployer(pf);
////////            ms.setProfessionalTax(tax);
////////            ms.setGrossSalary(gross);
////////            ms.setNetSalary(net);
////////            ms.setWorkedDays((int) payableDays);
////////            ms.setTotalWorkingDays(workingDays);
////////            ms.setStatus(MonthlySalary.Status.RUNNING);
////////
////////            monthlySalaryRepository.save(ms);
////////        }
////////
////////        log.info("✅ Salary recalculation & status update completed for {}", currentMonth);
////////    }
////////
////////    // Utility: get working days excluding weekends
////////    private int getWorkingDaysInMonth(YearMonth ym) {
////////        int workingDays = 0;
////////        for (int day = 1; day <= ym.lengthOfMonth(); day++) {
////////            DayOfWeek dow = ym.atDay(day).getDayOfWeek();
////////            if (dow != DayOfWeek.SATURDAY && dow != DayOfWeek.SUNDAY) {
////////                workingDays++;
////////            }
////////        }
////////        return workingDays;
////////    }
////////
////////    // Overload to allow direct int params
////////    private int getWorkingDaysInMonth(int year, int month) {
////////        return getWorkingDaysInMonth(YearMonth.of(year, month));
////////    }
////////
////////    // Create new salary entry if missing
////////    private MonthlySalary createNewMonthlySalary(Employee emp, YearMonth ym, int workingDays) {
////////        MonthlySalary ms = MonthlySalary.builder()
////////                .employee(emp)
////////                .month(ym)
////////                .basic(0)
////////                .flexibleBenefitPlan(0)
////////                .specialAllowance(0)
////////                .pfContributionEmployer(0)
////////                .professionalTax(0)
////////                .grossSalary(0)
////////                .netSalary(0)
////////                .totalWorkingDays(workingDays)
////////                .workedDays(0)
////////                .status(MonthlySalary.Status.RUNNING)
////////                .build();
////////
////////        return monthlySalaryRepository.save(ms);
////////    }
////////}
//////
//////package com.VentureBiz.VenureBiz_Hr.scheduler;
//////
//////import com.VentureBiz.VenureBiz_Hr.model.Employee;
//////import com.VentureBiz.VenureBiz_Hr.model.MonthlySalary;
//////import com.VentureBiz.VenureBiz_Hr.model.SalaryPackage;
//////import com.VentureBiz.VenureBiz_Hr.repository.*;
//////import lombok.RequiredArgsConstructor;
//////import lombok.extern.slf4j.Slf4j;
//////import org.springframework.scheduling.annotation.Scheduled;
//////import org.springframework.stereotype.Component;
//////
//////import java.time.LocalDate;
//////import java.time.YearMonth;
//////import java.util.List;
//////
//////@Slf4j
//////@Component
//////@RequiredArgsConstructor
//////public class UnifiedSalaryScheduler {
//////
//////    private final MonthlySalaryRepository monthlySalaryRepository;
//////    private final SalaryPackageRepository salaryPackageRepository;
//////    private final EmployeeRepository employeeRepository;
//////    private final AttendanceRepository attendanceRepository;
//////    private final LeaveRepository leaveRepository;
//////    private final HolidayRepository holidayRepository;
//////
//////    /**
//////     * Runs once daily at 12:10 AM
//////     * Handles salary recalculation with weekend and holiday inclusion.
//////     */
//////    @Scheduled(cron = "0 10 0 * * *")
//////    public void processSalaries() {
//////        LocalDate today = LocalDate.now();
//////        YearMonth currentMonth = YearMonth.from(today);
//////        YearMonth previousMonth = currentMonth.minusMonths(1);
//////
//////        log.info("💼 Salary processing started for {}", currentMonth);
//////
//////        // 1️⃣ Mark previous month salaries as PAID
//////        monthlySalaryRepository.findByMonth(previousMonth).forEach(ms -> {
//////            if (ms.getStatus() != MonthlySalary.Status.PAID) {
//////                ms.setStatus(MonthlySalary.Status.PAID);
//////                monthlySalaryRepository.save(ms);
//////                log.info("✅ Marked salary as PAID for {} ({})", ms.getEmployee().getName(), previousMonth);
//////            }
//////        });
//////
//////        // 2️⃣ Process current month salaries
//////        List<Employee> employees = employeeRepository.findAll();
//////
//////        int totalWorkingDays = getAllDaysExcludingHolidays(currentMonth); // includes weekends
//////
//////        for (Employee emp : employees) {
//////            MonthlySalary ms = monthlySalaryRepository
//////                    .findByEmployeeAndMonth(emp, currentMonth)
//////                    .orElseGet(() -> createNewMonthlySalary(emp, currentMonth, totalWorkingDays));
//////
//////            // ✅ Count PRESENT attendance across the whole month (includes weekends)
//////            long presentDays = attendanceRepository.countByUserAndStatusAndMonth(
//////                    emp.getUser(), "PRESENT", currentMonth.getYear(), currentMonth.getMonthValue());
//////
//////            // ✅ Count approved sick leaves
//////            long sickLeaves = leaveRepository.countApprovedSickLeaves(
//////                    emp.getUser(), currentMonth.getYear(), currentMonth.getMonthValue());
//////
//////            // ✅ Get salary package
//////            SalaryPackage sp = salaryPackageRepository.findByEmployee(emp)
//////                    .orElseThrow(() -> new RuntimeException("Salary package not found for " + emp.getName()));
//////
//////            long lopDays = sp.getLop() != 0 ? Math.round(sp.getLop()) : 0;
//////
//////            // ✅ Add holidays as paid days
//////            int holidays = getHolidayCountInMonth(currentMonth);
//////
//////            // ✅ Payable days = PRESENT + HOLIDAYS + APPROVED LEAVES - LOP
//////            long payableDays = Math.max(0, presentDays + sickLeaves + holidays - lopDays);
//////
//////            double factor = (double) payableDays / totalWorkingDays;
//////
//////            // 💰 Salary calculation
//////            double basic = sp.getBasic() / 12 * factor;
//////            double flexible = sp.getFlexibleBenefitPlan() / 12 * factor;
//////            double special = sp.getSpecialAllowance() / 12 * factor;
//////            double pf = sp.getPfContributionEmployer() / 12 * factor;
//////            double tax = sp.getProfessionalTax() / 12 * factor;
//////            double gross = basic + flexible + special + pf;
//////            double net = gross - tax;
//////
//////            ms.setBasic(basic);
//////            ms.setFlexibleBenefitPlan(flexible);
//////            ms.setSpecialAllowance(special);
//////            ms.setPfContributionEmployer(pf);
//////            ms.setProfessionalTax(tax);
//////            ms.setGrossSalary(gross);
//////            ms.setNetSalary(net);
//////            ms.setWorkedDays((int) payableDays);
//////            ms.setTotalWorkingDays(totalWorkingDays);
//////            ms.setStatus(MonthlySalary.Status.RUNNING);
//////
//////            monthlySalaryRepository.save(ms);
//////        }
//////
//////        log.info("✅ Salary recalculation completed for {}", currentMonth);
//////    }
//////
//////    /** 🗓️ Count all calendar days excluding holidays (weekends INCLUDED) */
//////    private int getAllDaysExcludingHolidays(YearMonth ym) {
//////        int count = 0;
//////        for (int d = 1; d <= ym.lengthOfMonth(); d++) {
//////            LocalDate date = ym.atDay(d);
//////            if (!holidayRepository.existsByDate(date)) {
//////                count++;
//////            }
//////        }
//////        return count;
//////    }
//////
//////    /** 🗓️ Count total holidays in the given month */
//////    private int getHolidayCountInMonth(YearMonth ym) {
//////        int count = 0;
//////        for (int d = 1; d <= ym.lengthOfMonth(); d++) {
//////            LocalDate date = ym.atDay(d);
//////            if (holidayRepository.existsByDate(date)) {
//////                count++;
//////            }
//////        }
//////        return count;
//////    }
//////
//////    /** 🆕 Create new monthly salary entry if missing */
//////    private MonthlySalary createNewMonthlySalary(Employee emp, YearMonth ym, int workingDays) {
//////        return monthlySalaryRepository.save(
//////                MonthlySalary.builder()
//////                        .employee(emp)
//////                        .month(ym)
//////                        .basic(0)
//////                        .flexibleBenefitPlan(0)
//////                        .specialAllowance(0)
//////                        .pfContributionEmployer(0)
//////                        .professionalTax(0)
//////                        .grossSalary(0)
//////                        .netSalary(0)
//////                        .totalWorkingDays(workingDays)
//////                        .workedDays(0)
//////                        .status(MonthlySalary.Status.RUNNING)
//////                        .build()
//////        );
//////    }
//////}
////////
//////package com.VentureBiz.VenureBiz_Hr.scheduler;
//////
//////import com.VentureBiz.VenureBiz_Hr.model.Employee;
//////import com.VentureBiz.VenureBiz_Hr.model.MonthlySalary;
//////import com.VentureBiz.VenureBiz_Hr.model.SalaryPackage;
//////import com.VentureBiz.VenureBiz_Hr.repository.*;
//////import lombok.RequiredArgsConstructor;
//////import lombok.extern.slf4j.Slf4j;
//////import org.springframework.scheduling.annotation.Scheduled;
//////import org.springframework.stereotype.Component;
//////
//////import java.time.DayOfWeek;
//////import java.time.LocalDate;
//////import java.time.YearMonth;
//////import java.util.List;
//////
//////@Slf4j
//////@Component
//////@RequiredArgsConstructor
//////public class UnifiedSalaryScheduler {
//////
//////    private final MonthlySalaryRepository monthlySalaryRepository;
//////    private final SalaryPackageRepository salaryPackageRepository;
//////    private final EmployeeRepository employeeRepository;
//////    private final AttendanceRepository attendanceRepository;
//////    private final LeaveRepository leaveRepository;
//////    private final HolidayRepository holidayRepository;
//////
//////    /**
//////     * 💰 Scheduler runs daily at 12:10 AM
//////     * - Marks previous month as PAID
//////     * - Calculates current month salaries
//////     * - Weekends + Holidays are always paid
//////     * - Only APPROVED sick leaves are counted as paid
//////     */
//////    @Scheduled(cron = "0 10 0 * * *")
//////    public void processSalaries() {
//////        LocalDate today = LocalDate.now();
//////        YearMonth currentMonth = YearMonth.from(today);
//////        YearMonth previousMonth = currentMonth.minusMonths(1);
//////
//////        log.info("💼 Salary processing started for {}", currentMonth);
//////
//////        // 1️⃣ Mark previous month salaries as PAID
//////        monthlySalaryRepository.findByMonth(previousMonth).forEach(ms -> {
//////            if (ms.getStatus() != MonthlySalary.Status.PAID) {
//////                ms.setStatus(MonthlySalary.Status.PAID);
//////                monthlySalaryRepository.save(ms);
//////                log.info("✅ Marked salary as PAID for {} ({})",
//////                        ms.getEmployee().getName(), previousMonth);
//////            }
//////        });
//////
//////        // 2️⃣ Process current month salaries
//////        List<Employee> employees = employeeRepository.findAll();
//////        int totalDaysInMonth = currentMonth.lengthOfMonth(); // includes weekends & holidays
//////
//////        for (Employee emp : employees) {
//////
//////            MonthlySalary ms = monthlySalaryRepository
//////                    .findByEmployeeAndMonth(emp, currentMonth)
//////                    .orElseGet(() -> createNewMonthlySalary(emp, currentMonth, totalDaysInMonth));
//////
//////            // ✅ Count present days
//////            long presentDays = attendanceRepository.countByUserAndStatusAndMonth(
//////                    emp.getUser(), "PRESENT", currentMonth.getYear(), currentMonth.getMonthValue());
//////
//////            // ✅ Count only approved SICK leaves
//////            long sickLeaves = leaveRepository.countApprovedSickLeaves(
//////                    emp.getUser(), currentMonth.getYear(), currentMonth.getMonthValue());
//////
//////            // ✅ Count holidays (always paid)
//////            int holidays = getHolidayCountInMonth(currentMonth);
//////
//////            // ✅ Count weekends (always paid)
//////            int weekendDays = getWeekendCountInMonth(currentMonth);
//////
//////            // ✅ Get salary package
//////            SalaryPackage sp = salaryPackageRepository.findByEmployee(emp)
//////                    .orElseThrow(() -> new RuntimeException(
//////                            "Salary package not found for " + emp.getName()));
//////
//////            // ✅ Handle LOP (Loss of Pay)
//////            long lopDays = sp.getLop() != 0 ? Math.round(sp.getLop()) : 0;
//////
//////            // ✅ Calculate payable days
//////            long payableDays = Math.max(0, presentDays + sickLeaves + holidays + weekendDays - lopDays);
//////            if (payableDays > totalDaysInMonth) payableDays = totalDaysInMonth; // prevent overflow
//////
//////            double factor = (double) payableDays / totalDaysInMonth;
//////
//////            // 💵 Calculate monthly salary (pro-rated)
//////            double basic = sp.getBasic() / 12 * factor;
//////            double flexible = sp.getFlexibleBenefitPlan() / 12 * factor;
//////            double special = sp.getSpecialAllowance() / 12 * factor;
//////            double pf = sp.getPfContributionEmployer() / 12 * factor;
//////            double tax = sp.getProfessionalTax() / 12 * factor;
//////            double gross = basic + flexible + special + pf;
//////            double net = gross - tax;
//////
//////            // 💾 Update salary record
//////            ms.setBasic(basic);
//////            ms.setFlexibleBenefitPlan(flexible);
//////            ms.setSpecialAllowance(special);
//////            ms.setPfContributionEmployer(pf);
//////            ms.setProfessionalTax(tax);
//////            ms.setGrossSalary(gross);
//////            ms.setNetSalary(net);
//////            ms.setWorkedDays((int) payableDays);
//////            ms.setTotalWorkingDays(totalDaysInMonth);
//////            ms.setStatus(MonthlySalary.Status.RUNNING);
//////
//////            monthlySalaryRepository.save(ms);
//////        }
//////
//////        log.info("✅ Salary recalculation completed for {}", currentMonth);
//////    }
//////
//////    /** 🗓️ Count number of weekends (Saturday + Sunday) in the month */
//////    private int getWeekendCountInMonth(YearMonth ym) {
//////        int count = 0;
//////        for (int day = 1; day <= ym.lengthOfMonth(); day++) {
//////            DayOfWeek dow = ym.atDay(day).getDayOfWeek();
//////            if (dow == DayOfWeek.SATURDAY || dow == DayOfWeek.SUNDAY) {
//////                count++;
//////            }
//////        }
//////        return count;
//////    }
//////
//////    /** 🗓️ Count number of holidays in the month */
//////    private int getHolidayCountInMonth(YearMonth ym) {
//////        int count = 0;
//////        for (int d = 1; d <= ym.lengthOfMonth(); d++) {
//////            LocalDate date = ym.atDay(d);
//////            if (holidayRepository.existsByDate(date)) {
//////                count++;
//////            }
//////        }
//////        return count;
//////    }
//////
//////    /** 🆕 Create new MonthlySalary record if missing */
//////    private MonthlySalary createNewMonthlySalary(Employee emp, YearMonth ym, int totalDays) {
//////        return monthlySalaryRepository.save(
//////                MonthlySalary.builder()
//////                        .employee(emp)
//////                        .month(ym)
//////                        .basic(0)
//////                        .flexibleBenefitPlan(0)
//////                        .specialAllowance(0)
//////                        .pfContributionEmployer(0)
//////                        .professionalTax(0)
//////                        .grossSalary(0)
//////                        .netSalary(0)
//////                        .totalWorkingDays(totalDays)
//////                        .workedDays(0)
//////                        .status(MonthlySalary.Status.RUNNING)
//////                        .build()
//////        );
//////    }
//////}
//////
////package com.VentureBiz.VenureBiz_Hr.scheduler;
////
////import com.VentureBiz.VenureBiz_Hr.model.Employee;
////import com.VentureBiz.VenureBiz_Hr.model.MonthlySalary;
////import com.VentureBiz.VenureBiz_Hr.model.SalaryPackage;
////import com.VentureBiz.VenureBiz_Hr.repository.*;
////import lombok.RequiredArgsConstructor;
////import lombok.extern.slf4j.Slf4j;
////import org.springframework.scheduling.annotation.Scheduled;
////import org.springframework.stereotype.Component;
////
////import java.time.DayOfWeek;
////import java.time.LocalDate;
////import java.time.YearMonth;
////import java.util.HashSet;
////import java.util.List;
////import java.util.Set;
////
////@Slf4j
////@Component
////@RequiredArgsConstructor
////public class UnifiedSalaryScheduler {
////
////    private final MonthlySalaryRepository monthlySalaryRepository;
////    private final SalaryPackageRepository salaryPackageRepository;
////    private final EmployeeRepository employeeRepository;
////    private final AttendanceRepository attendanceRepository;
////    private final LeaveRepository leaveRepository;
////    private final HolidayRepository holidayRepository;
////
////    /**
////     * 💰 Scheduler runs daily at 12:10 AM
////     * - Marks previous month as PENDING
////     * - Calculates current month salaries
////     * - Weekends + Holidays (unique) are always paid
////     * - Only APPROVED sick leaves are counted as paid
////     * - HR manually marks PENDING → PAID
////     */
////    @Scheduled(cron = "0 10 0 * * *")
////    public void processSalaries() {
////        LocalDate today = LocalDate.now();
////        YearMonth currentMonth = YearMonth.from(today);
////        YearMonth previousMonth = currentMonth.minusMonths(1);
////
////        log.info("💼 Salary processing started for {}", currentMonth);
////
////        // 1️⃣ Mark previous month salaries as PENDING
////        monthlySalaryRepository.findByMonth(previousMonth).forEach(ms -> {
////            if (ms.getStatus() == MonthlySalary.Status.RUNNING) {
////                ms.setStatus(MonthlySalary.Status.PENDING);
////                monthlySalaryRepository.save(ms);
////                log.info(" Marked salary as PENDING for {} ({})",
////                        ms.getEmployee().getName(), previousMonth);
////            }
////        });
////
////        // 2️⃣ Process current month salaries
////        List<Employee> employees = employeeRepository.findAll();
////        int totalDaysInMonth = currentMonth.lengthOfMonth();
////
////        for (Employee emp : employees) {
////
////            MonthlySalary ms = monthlySalaryRepository
////                    .findByEmployeeAndMonth(emp, currentMonth)
////                    .orElseGet(() -> createNewMonthlySalary(emp, currentMonth, totalDaysInMonth));
////
////            // ✅ Attendance and Leave Data
////            long presentDays = attendanceRepository.countByUserAndStatusAndMonth(
////                    emp.getUser(), "PRESENT", currentMonth.getYear(), currentMonth.getMonthValue());
////            long sickLeaves = leaveRepository.countApprovedSickLeaves(
////                    emp.getUser(), currentMonth.getYear(), currentMonth.getMonthValue());
////
////            // ✅ Combined count of weekends + holidays (no duplicates)
////            int paidOffDays = getUniquePaidOffDaysUpToToday(currentMonth);
////
////            // ✅ Get Salary Package
////            SalaryPackage sp = salaryPackageRepository.findByEmployee(emp)
////                    .orElseThrow(() -> new RuntimeException(
////                            "Salary package not found for " + emp.getName()));
////
////            // ✅ Handle LOP (Loss of Pay)
////            long lopDays = sp.getLop() != 0 ? Math.round(sp.getLop()) : 0;
////
////            // ✅ Payable days = present + sick + (unique paid offs) - LOP
////            long payableDays = Math.max(0, presentDays + sickLeaves + paidOffDays - lopDays);
////            if (payableDays > totalDaysInMonth) payableDays = totalDaysInMonth;
////
////            double factor = (double) payableDays / totalDaysInMonth;
////
////            // 💵 Salary calculation
////            double basic = sp.getBasic() / 12 * factor;
////            double flexible = sp.getFlexibleBenefitPlan() / 12 * factor;
////            double special = sp.getSpecialAllowance() / 12 * factor;
////            double pf = sp.getPfContributionEmployer() / 12 * factor;
////            double tax = sp.getProfessionalTax() / 12 * factor;
////            double gross = basic + flexible + special + pf;
////            double net = gross - tax;
////
////            // 💾 Save salary
////            ms.setBasic(basic);
////            ms.setFlexibleBenefitPlan(flexible);
////            ms.setSpecialAllowance(special);
////            ms.setPfContributionEmployer(pf);
////            ms.setProfessionalTax(tax);
////            ms.setGrossSalary(gross);
////            ms.setNetSalary(net);
////            ms.setWorkedDays((int) payableDays);
////            ms.setTotalWorkingDays(totalDaysInMonth);
////            ms.setStatus(MonthlySalary.Status.RUNNING);
////
////            monthlySalaryRepository.save(ms);
////        }
////
////        log.info(" Salary recalculation completed for {}", currentMonth);
////    }
////
////    /**  Count unique paid-off days (weekends + holidays), up to today if current month */
////    private int getUniquePaidOffDaysUpToToday(YearMonth ym) {
////        LocalDate today = LocalDate.now();
////        int daysToCount = ym.equals(YearMonth.from(today)) ? today.getDayOfMonth() : ym.lengthOfMonth();
////
////        Set<LocalDate> paidOffDays = new HashSet<>();
////
////        for (int day = 1; day <= daysToCount; day++) {
////            LocalDate date = ym.atDay(day);
////            DayOfWeek dow = date.getDayOfWeek();
////
////            // Add weekends
////            if (dow == DayOfWeek.SATURDAY || dow == DayOfWeek.SUNDAY) {
////                paidOffDays.add(date);
////            }
////
////            // Add holidays (automatically ignores duplicates)
////            if (holidayRepository.existsByDate(date)) {
////                paidOffDays.add(date);
////            }
////        }
////        return paidOffDays.size();
////    }
////
////    /** 🆕 Create new MonthlySalary record if missing */
////    private MonthlySalary createNewMonthlySalary(Employee emp, YearMonth ym, int totalDays) {
////        return monthlySalaryRepository.save(
////                MonthlySalary.builder()
////                        .employee(emp)
////                        .month(ym)
////                        .basic(0)
////                        .flexibleBenefitPlan(0)
////                        .specialAllowance(0)
////                        .pfContributionEmployer(0)
////                        .professionalTax(0)
////                        .grossSalary(0)
////                        .netSalary(0)
////                        .totalWorkingDays(totalDays)
////                        .workedDays(0)
////                        .status(MonthlySalary.Status.RUNNING)
////                        .build()
////        );
////    }
////}
//
//package com.VentureBiz.VenureBiz_Hr.scheduler;
//
//import com.VentureBiz.VenureBiz_Hr.model.Employee;
//import com.VentureBiz.VenureBiz_Hr.model.MonthlySalary;
//import com.VentureBiz.VenureBiz_Hr.model.SalaryPackage;
//import com.VentureBiz.VenureBiz_Hr.repository.*;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.scheduling.annotation.Scheduled;
//import org.springframework.stereotype.Component;
//
//import java.time.DayOfWeek;
//import java.time.LocalDate;
//import java.time.YearMonth;
//import java.util.HashSet;
//import java.util.List;
//import java.util.Set;
//
//@Slf4j
//@Component
//@RequiredArgsConstructor
//public class UnifiedSalaryScheduler {
//
//    private final MonthlySalaryRepository monthlySalaryRepository;
//    private final SalaryPackageRepository salaryPackageRepository;
//    private final EmployeeRepository employeeRepository;
//    private final AttendanceRepository attendanceRepository;
//    private final LeaveRepository leaveRepository;
//    private final HolidayRepository holidayRepository;
//
//    @Scheduled(cron = "0 10 0 * * *")
//    public void processSalaries() {
//        LocalDate today = LocalDate.now();
//        YearMonth currentMonth = YearMonth.from(today);
//        YearMonth previousMonth = currentMonth.minusMonths(1);
//
//        log.info("💼 Salary processing started for {}", currentMonth);
//
//        // 1️⃣ Mark previous month salaries as PENDING (if still running)
//        monthlySalaryRepository.findByMonth(previousMonth).forEach(ms -> {
//            if (ms.getStatus() == MonthlySalary.Status.RUNNING) {
//                ms.setStatus(MonthlySalary.Status.PENDING);
//                monthlySalaryRepository.save(ms);
//                log.info("✅ Marked salary as PENDING for {} ({})",
//                        ms.getEmployee().getName(), previousMonth);
//            }
//        });
//
//        // 2️⃣ Process current month salaries
//        List<Employee> employees = employeeRepository.findAll();
//        int totalDaysInMonth = currentMonth.lengthOfMonth();
//
//        for (Employee emp : employees) {
//
//            // ✅ SAFE: Skip employee if no salary package exists
//            SalaryPackage sp = salaryPackageRepository.findByEmployee(emp).orElse(null);
//            if (sp == null) {
//                log.warn("⚠️ Skipping salary calculation for {} - No salary package found", emp.getName());
//                continue;
//            }
//
//            MonthlySalary ms = monthlySalaryRepository
//                    .findByEmployeeAndMonth(emp, currentMonth)
//                    .orElseGet(() -> createNewMonthlySalary(emp, currentMonth, totalDaysInMonth));
//
//            // ✅ Attendance calculation (full + half day)
//            long fullDays = attendanceRepository.countByUserAndStatusAndMonth(
//                    emp.getUser(), "PRESENT", currentMonth.getYear(), currentMonth.getMonthValue());
//
//            long halfDays = attendanceRepository.countHalfDays(
//                    emp.getUser(), currentMonth.getYear(), currentMonth.getMonthValue());
//
//            double presentDays = fullDays + (halfDays * 0.5);
//
//            long sickLeaves = leaveRepository.countApprovedSickLeaves(
//                    emp.getUser(), currentMonth.getYear(), currentMonth.getMonthValue());
//
//            int paidOffDays = getUniquePaidOffDaysUpToToday(currentMonth);
//
//            long lopDays = sp.getLop() != 0 ? Math.round(sp.getLop()) : 0;
//
////            long payableDays = Math.max(0, presentDays + sickLeaves + paidOffDays - lopDays);
//            double payableDays = Math.max(0, presentDays + sickLeaves + paidOffDays - lopDays);
//
//            if (payableDays > totalDaysInMonth) payableDays = totalDaysInMonth;
//
//            double factor = (double) payableDays / totalDaysInMonth;
//
//            double basic = sp.getBasic() / 12 * factor;
//            double flexible = sp.getFlexibleBenefitPlan() / 12 * factor;
//            double special = sp.getSpecialAllowance() / 12 * factor;
//            double pf = sp.getPfContributionEmployer() / 12 * factor;
//            double tax = sp.getProfessionalTax() / 12 * factor;
//            double gross = basic + flexible + special + pf;
//            double net = gross - tax;
//
//            ms.setBasic(basic);
//            ms.setFlexibleBenefitPlan(flexible);
//            ms.setSpecialAllowance(special);
//            ms.setPfContributionEmployer(pf);
//            ms.setProfessionalTax(tax);
//            ms.setGrossSalary(gross);
//            ms.setNetSalary(net);
//            ms.setWorkedDays((int) payableDays);
//            ms.setTotalWorkingDays(totalDaysInMonth);
//            ms.setStatus(MonthlySalary.Status.RUNNING);
//
//            monthlySalaryRepository.save(ms);
//        }
//
//        log.info("✅ Salary recalculation completed for {}", currentMonth);
//    }
//
//    private int getUniquePaidOffDaysUpToToday(YearMonth ym) {
//        LocalDate today = LocalDate.now();
//        int daysToCount = ym.equals(YearMonth.from(today)) ? today.getDayOfMonth() : ym.lengthOfMonth();
//        Set<LocalDate> paidOffDays = new HashSet<>();
//
//        for (int day = 1; day <= daysToCount; day++) {
//            LocalDate date = ym.atDay(day);
//            DayOfWeek dow = date.getDayOfWeek();
//
//            if (dow == DayOfWeek.SATURDAY || dow == DayOfWeek.SUNDAY) paidOffDays.add(date);
//            if (holidayRepository.existsByDate(date)) paidOffDays.add(date);
//        }
//        return paidOffDays.size();
//    }
//
//    private MonthlySalary createNewMonthlySalary(Employee emp, YearMonth ym, int totalDays) {
//        return monthlySalaryRepository.save(
//                MonthlySalary.builder()
//                        .employee(emp)
//                        .month(ym)
//                        .basic(0)
//                        .flexibleBenefitPlan(0)
//                        .specialAllowance(0)
//                        .pfContributionEmployer(0)
//                        .professionalTax(0)
//                        .grossSalary(0)
//                        .netSalary(0)
//                        .totalWorkingDays(totalDays)
//                        .workedDays(0)
//                        .status(MonthlySalary.Status.RUNNING)
//                        .build()
//        );
//    }
//}
//

// src/main/java/com/VentureBiz/VenureBiz_Hr/scheduler/UnifiedSalaryScheduler.java
package com.VentureBiz.VenureBiz_Hr.scheduler;

import com.VentureBiz.VenureBiz_Hr.model.Employee;
import com.VentureBiz.VenureBiz_Hr.model.MonthlySalary;
import com.VentureBiz.VenureBiz_Hr.model.SalaryPackage;
import com.VentureBiz.VenureBiz_Hr.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Slf4j
@Component
@RequiredArgsConstructor
public class UnifiedSalaryScheduler {

    private final MonthlySalaryRepository monthlySalaryRepository;
    private final SalaryPackageRepository salaryPackageRepository;
    private final EmployeeRepository employeeRepository;
    private final AttendanceRepository attendanceRepository;
    private final LeaveRepository leaveRepository;
    private final HolidayRepository holidayRepository;

    /**
     * Runs daily at 12:10 AM.
     * - Marks previous month RUNNING → PENDING
     * - Calculates current month salaries
     * - Weekends + Holidays (unique) are paid
     * - HALF_DAY = 0.5
     * - Skips employees without salary package (no crash)
     */
    @Scheduled(cron = "0 10 0 * * *")
    public void processSalaries() {
        LocalDate today = LocalDate.now();
        YearMonth currentMonth = YearMonth.from(today);
        YearMonth previousMonth = currentMonth.minusMonths(1);

        log.info(" Salary processing started for {}", currentMonth);

        // 1) Mark previous month as PENDING if still RUNNING
        monthlySalaryRepository.findByMonth(previousMonth).forEach(ms -> {
            if (ms.getStatus() == MonthlySalary.Status.RUNNING) {
                ms.setStatus(MonthlySalary.Status.PENDING);
                monthlySalaryRepository.save(ms);
                log.info(" Marked salary as PENDING for {} ({})",
                        ms.getEmployee().getName(), previousMonth);
            }
        });

        // 2) Process current month salaries
        List<Employee> employees = employeeRepository.findAll();
        int totalDaysInMonth = currentMonth.lengthOfMonth(); // full calendar days (weekends included)

        for (Employee emp : employees) {

            // ✅ SAFE: skip employee if no salary package
            SalaryPackage sp = salaryPackageRepository.findByEmployee(emp).orElse(null);
            if (sp == null) {
                log.warn("⚠️ Skipping salary calculation for {} - No salary package found", emp.getName());
                continue;
            }

            MonthlySalary ms = monthlySalaryRepository
                    .findByEmployeeAndMonth(emp, currentMonth)
                    .orElseGet(() -> createNewMonthlySalary(emp, currentMonth, totalDaysInMonth));

            // ✅ Attendance: full + half day
            long fullDays = attendanceRepository.countByUserAndStatusAndMonth(
                    emp.getUser(), "PRESENT", currentMonth.getYear(), currentMonth.getMonthValue());
            long halfDays = attendanceRepository.countHalfDays(
                    emp.getUser(), currentMonth.getYear(), currentMonth.getMonthValue());
            double presentDays = fullDays + (halfDays * 0.5);

            // Approved sick leaves (paid)
            long sickLeaves = leaveRepository.countApprovedSickLeaves(
                    emp.getUser(), currentMonth.getYear(), currentMonth.getMonthValue());

            // Weekends + holidays (unique, paid)
            int paidOffDays = getUniquePaidOffDaysUpToToday(currentMonth);

            // LOP from package
            long lopDays = sp.getLop() != 0 ? Math.round(sp.getLop()) : 0;

            // ✅ Payable days as double (to keep .5)
            double payableDays = Math.max(0, presentDays + sickLeaves + paidOffDays - lopDays);
            if (payableDays > totalDaysInMonth) payableDays = totalDaysInMonth;

            double factor = payableDays / totalDaysInMonth;

            // 💵 Pro-rated salary calculation
            double basic = sp.getBasic() / 12 * factor;
            double flexible = sp.getFlexibleBenefitPlan() / 12 * factor;
            double special = sp.getSpecialAllowance() / 12 * factor;
            double pf = sp.getPfContributionEmployer() / 12 * factor;
            double tax = sp.getProfessionalTax() / 12 * factor;
            double gross = basic + flexible + special + pf;
            double net = gross - tax;

            // 💾 Save
            ms.setBasic(basic);
            ms.setFlexibleBenefitPlan(flexible);
            ms.setSpecialAllowance(special);
            ms.setPfContributionEmployer(pf);
            ms.setProfessionalTax(tax);
            ms.setGrossSalary(gross);
            ms.setNetSalary(net);
            ms.setWorkedDays(payableDays);            // ✅ stores decimals
            ms.setTotalWorkingDays(totalDaysInMonth);
            ms.setStatus(MonthlySalary.Status.RUNNING);

            monthlySalaryRepository.save(ms);
        }

        log.info(" Salary recalculation completed for {}", currentMonth);
    }

    /** Unique weekends + holidays up to today if same month */
    private int getUniquePaidOffDaysUpToToday(YearMonth ym) {
        LocalDate today = LocalDate.now();
        int daysToCount = ym.equals(YearMonth.from(today)) ? today.getDayOfMonth() : ym.lengthOfMonth();

        Set<LocalDate> paidOffDays = new HashSet<>();
        for (int day = 1; day <= daysToCount; day++) {
            LocalDate date = ym.atDay(day);
            DayOfWeek dow = date.getDayOfWeek();
            if (dow == DayOfWeek.SATURDAY || dow == DayOfWeek.SUNDAY) {
                paidOffDays.add(date);
            }
            if (holidayRepository.existsByDate(date)) {
                paidOffDays.add(date);
            }
        }
        return paidOffDays.size();
    }

    private MonthlySalary createNewMonthlySalary(Employee emp, YearMonth ym, int totalDays) {
        return monthlySalaryRepository.save(
                MonthlySalary.builder()
                        .employee(emp)
                        .month(ym)
                        .basic(0)
                        .flexibleBenefitPlan(0)
                        .specialAllowance(0)
                        .pfContributionEmployer(0)
                        .professionalTax(0)
                        .grossSalary(0)
                        .netSalary(0)
                        .totalWorkingDays(totalDays)
                        .workedDays(0) // double field, set 0 initially
                        .status(MonthlySalary.Status.RUNNING)
                        .build()
        );
    }
}

