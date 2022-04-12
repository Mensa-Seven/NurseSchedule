#ref Hands-On-Genetic-Algorithms-with-Python
#conpyright PacktPublishing
import numpy as np

class  NurseScheduling:

    def __init__(self, hardConstraintPenalty):
        """
        :param hardConstraintPenalty: the penalty factor for a hard-constraint violation
        """

        self._hardConstraintPenalty = hardConstraintPenalty
        #list of nurses รายชื่อพยาบาล
        self._nurses = ['(1)พยาบาล', '(2)พยาบาล', '(3)พยาบาล', '(4)พยาบาล', '(5)พยาบาล', '(6)พยาบาล', '(7พยาบาล)', '(8)พยาบาล']
        '''
        nurses' respective shift preferences - morning, evening, night:

        เตรียมผลัดของพยาบาล
        '''
        self._shiftPreference = [
        [1, 0, 0],
        [1, 1, 0],
        [0, 0, 1],
        [0, 1, 0],

        [0, 0, 1],
        [1, 1, 1],
        [0, 1, 1],
        [1, 1, 1]
        ]

        '''
        defind shift morning, evening, night
        กำหนดจำนวนพยาบาลที่จะสามารถลงผลัดได้ในเเต่ละวัน กำหนดต่ำสุดเเละสูงสุด
        ต่ำสุด เช้า  2, บ่าย 2, ดึก 1
        สูงสุด เช้า 3, บ่าย 4 , ดึก 2
        '''
        self._shiftMin = [2, 2, 1]
        self._shiftMax = [3, 4, 2]

        '''
        max shift allow for each nurse
        กำหนดว่าในเเต่ละ Week นั้นหมายความว่า พยาบาลหนึ่งคนจะลงได้เเค่ 5 ผลัดในเเต่ละ Week
        '''
        self._maxShiftsPerWeek = 5

        '''
        จำนวนที่จะสร้าง Schedule
        number of week for create Schedule
        '''
        self._weeks = 1

        #self._shiftDay = 3
        #self._shiftWeek = 21
        self._shiftDay = len(self._shiftMin)
        self._shiftWeek = 7 * self._shiftDay

    def __len__(self):
        '''
        return the number of shifts in the schedule
        ส่งตัวเลขจำนวนผลัดในตาราง
        จำนวนพยาบาล x จำนวนผลัดในเเต่ละ week x จำนวน week ที่จะสร้าง
        '''
        return len(self._nurses) * self._shiftWeek * self._weeks

    def getCost(self, schedule):

        """
        Calculates the total cost of the various violations in the given schedule
        ...
        :param schedule: a list of binary values describing the given schedule
        :return: the calculated cost
        """

        if len(schedule) != self.__len__():
            raise ValueError("size of schedule list should be equal to ", self.__len__())

        # convert entire schedule into a dictionary with a separate schedule for each nurse:
        '''
        จำนวน Array ของพยาบาลในเเต่ละผลัด เช่น
        {'A': array([0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1])
         'B': array([0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 1])
        }
        '''
        nurseShiftsDict = self.getNurseShifts(schedule)

        # count the various violations:
        consecutiveShiftViolations = self.countConsecutiveShiftViolations(nurseShiftsDict)
        shiftsPerWeekViolations = self.countShiftsPerWeekViolations(nurseShiftsDict)[1]
        nursesPerShiftViolations = self.countNursesPerShiftViolations(nurseShiftsDict)[1]
        shiftPreferenceViolations = self.countShiftPreferenceViolations(nurseShiftsDict)

        # calculate the cost of the violations:
        hardContstraintViolations = consecutiveShiftViolations + nursesPerShiftViolations + shiftsPerWeekViolations
        softContstraintViolations = shiftPreferenceViolations

        return self._hardConstraintPenalty * hardContstraintViolations + softContstraintViolations

    def getNurseShifts(self, schedule):
        """
        ฟังก์ชันนี้จะส่ง schedule จัดเเล้วใส่ไปในตัวเเปรของ nurseShiftsDict
        return schedule ของพยาบาลทั้งหมด
        """
        #จำนวนผลัดทั้งหมด
        shiftsPerNurse = self.__len__() // len(self._nurses)
        #เอาไว้เก็บข้อมูลผลัดของเเต่ละคนเมื่อวัดเสร็จเเล้ว
        nurseShiftsDict = {}
        #เอาไว้เลื่อนตารางผลัดของเเต่ละคน
        shiftIndex = 0

        for nurse in self._nurses:
            #{'A': array([0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1])} ตัวอย่างข้อมูลที่จะเพิ่มเข้าไป
            #ขยับเพิ่มไปทีละคน
            nurseShiftsDict[nurse] = schedule[shiftIndex:shiftIndex + shiftsPerNurse]


            shiftIndex += shiftsPerNurse

        print('--------------------------------')
        return nurseShiftsDict

    def countConsecutiveShiftViolations(self, nurseShiftsDict):
        """
        Counts the consecutive shift violations in the schedule
        :param nurseShiftsDict: a dictionary with a separate schedule for each nurse
        :return: count of violations found
        """
        violations = 0
        # iterate over the shifts of each nurse:
        for nurseShifts in nurseShiftsDict.values():
            # look for two cosecutive '1's:
            for shift1, shift2 in zip(nurseShifts, nurseShifts[1:]):
                if shift1 == 1 and shift2 == 1:
                    violations += 1
        return violations

    def countShiftsPerWeekViolations(self, nurseShiftsDict):
        """
        ฟังก์ชันนี้จะเป็นการรวมผลัดของพยาบาลเเต่ละคน ใน 7 วัน
        :return: count of violations found
        """
        violations = 0
        weeklyShiftsList = []
        for nurseShifts in nurseShiftsDict.values():  # all shifts of a single nurse
            # iterate over the shifts of each weeks:
            for i in range(0, self._weeks * self._shiftWeek, self._shiftWeek):
                # count all the '1's over the week:

                #weeklyShifts 1 = [1 0 1 1 1 0 1 1 1 0 1 1 0 0 1 1 0 1 0 0 1]
                weeklyShifts = sum(nurseShifts[i:i + self._shiftWeek])
                weeklyShiftsList.append(weeklyShifts)
                # นับจำนวนผลัดที่เกินมา
                if weeklyShifts > self._maxShiftsPerWeek:
                    violations += weeklyShifts - self._maxShiftsPerWeek

        return weeklyShiftsList, violations


    def countNursesPerShiftViolations(self, nurseShiftsDict):
        """
        Counts the number-of-nurses-per-shift violations in the schedule
        :param nurseShiftsDict: a dictionary with a separate schedule for each nurse
        :return: count of violations found
        """
        # sum the shifts over all nurses:
        totalPerShiftList = [sum(shift) for shift in zip(*nurseShiftsDict.values())]

        violations = 0
        # iterate over all shifts and count violations:
        for shiftIndex, numOfNurses in enumerate(totalPerShiftList):
            dailyShiftIndex = shiftIndex % self._shiftDay  # -> 0, 1, or 2 for the 3 shifts per day
            if (numOfNurses > self._shiftMax[dailyShiftIndex]):
                violations += numOfNurses - self._shiftMax[dailyShiftIndex]
            elif (numOfNurses < self._shiftMin[dailyShiftIndex]):
                violations += self._shiftMin[dailyShiftIndex] - numOfNurses

        return totalPerShiftList, violations

    def countShiftPreferenceViolations(self, nurseShiftsDict):

        """
        Counts the nurse-preferences violations in the schedule
        :param nurseShiftsDict: a dictionary with a separate schedule for each nurse
        :return: count of violations found
        """
        violations = 0

        for nurseIndex, shiftPreference in enumerate(self._shiftPreference):

            print(f' shiftPreference {shiftPreference}')
            # duplicate the shift-preference over the days of the period
            # (self._shiftWeek // self._shiftDay) = 7
            preference = shiftPreference * (self._shiftWeek // self._shiftDay)
            print(f' preference {preference}')
            print('------------------------------------')
            # iterate over the shifts and compare to preferences:
            #shifts ผลัดของเเต่ละคน
            shifts = nurseShiftsDict[self._nurses[nurseIndex]]
            zipPer = zip(preference, shifts)

            for pref, shift in zip(preference, shifts):
                if pref == 0 and shift == 1:
                    violations += 1

        return violations

    def printScheduleInfo(self, schedule):
        """
        Prints the schedule and violations details
        :param schedule: a list of binary values describing the given schedule
        """
        nurseShiftsDict = self.getNurseShifts(schedule)

        print("ตารางของเวรพยาบาล:")
        for nurse in nurseShiftsDict:  # all shifts of a single nurse
            print(nurse, ":", nurseShiftsDict[nurse])

        print("consecutive shift violations = ", self.countConsecutiveShiftViolations(nurseShiftsDict))
        print()

        weeklyShiftsList, violations = self.countShiftsPerWeekViolations(nurseShiftsDict)
        print("จำนวนผลัดของพยาบาลทั้งหมด = ", weeklyShiftsList)
        print("Shifts Per Week Violations = ", violations)
        print()

        totalPerShiftList, violations = self.countNursesPerShiftViolations(nurseShiftsDict)
        print("Nurses Per Shift = ", totalPerShiftList)
        print("Nurses Per Shift Violations = ", violations)
        print()

        shiftPreferenceViolations = self.countShiftPreferenceViolations(nurseShiftsDict)
        print("Shift Preference Violations = ", shiftPreferenceViolations)
        print()


# testing the class:
def main():
    # create a problem instance:
    nurses = NurseScheduling(10)

    #randomSolution เป็นสุ่มตารางเวร
    randomSolution = np.random.randint(2, size=len(nurses))
    print("Random Solution = ")
    print(randomSolution)
    print()

    nurses.printScheduleInfo(randomSolution)

    print("Total Cost = ", nurses.getCost(randomSolution))


if __name__ == "__main__":
    main()
