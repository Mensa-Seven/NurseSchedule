import numpy as np
import sys

class Schedule(object):
    def __init__(self, nurse, day, shift = 20):
        ''' กำหนด constructor ของการสร้างตาราง '''
        #เก็บข้อมูลพยาบาล
        self._nurse = nurse
        #จำนวนวันที่ต้องการสร้าง
        self._day = day
        #กำหนดความยาวของยีน
        self._geneLen = day * 3
        #เก็บข้อมูลสมาชิกเเละตาราง
        self._nuresSchedule = {}
        self._shiftWeek = {}
        #เก็บข้อมูล sum ของการทำงานเเต่ละสัปดาห์
        self._countWeek = {}
        #นับจำนวนผลัดที่ขึ้นติดต่อกัน
        self.countConsecutive = 0
        self._shiftFrame = None
        self._week = 4
        self.shift = shift



    def Population(self, size):
        '''สุ่มค่า Population'''
        pop = np.random.randint(2, size = self._geneLen)

        return pop

    def ScheduleNures(self):
        ''' สร้างตารางตารางขึ้นเวร จากค่า Population '''

        for index, nurse in enumerate(self._nurse):
            self._nuresSchedule[nurse] = {
                "shiftWeek(1)":self.Population(size = self._day),
                "shiftWeek(2)":self.Population(size = self._day),
                "shiftWeek(3)":self.Population(size = self._day),
                "shiftWeek(4)":self.Population(size = self._day),
            }


        self.CountWeek()

    def PrintSchedule(self):
        ''' เเสดงค่าผลต่าง ๆ หลังจากกันจัดเรียงข้อมูลทั้งหมด'''
        #print('ตารางขึ้นเวร')
        for ind, nurse in enumerate(self._nuresSchedule):
            for i in range(self._week):
                print(f'{nurse}:{self._nuresSchedule[nurse][f"shiftWeek({i+1})"]}')

        # print("จำนวนรวมของการขึ้นผลัดในเเต่ละสัปดาห์")
        # for index, nurse in enumerate(self._countWeek):
        #     for i in range(self._week):
        #         print(f'{nurse} {self._countWeek[nurse][f"countWeek({i+1})"]}')



    def CountWeek(self):
        ''' สร้างเก็บข้อมููลการทำงานรวมในเเต่ละสัปดาห์'''
        shiftWeek = 1
        for index, nures in enumerate(self._nuresSchedule):
            self._countWeek[nures] = {
                "countWeek(1)":sum(self._nuresSchedule[nures][f"shiftWeek({shiftWeek})"]),
                "countWeek(2)":sum(self._nuresSchedule[nures][f"shiftWeek({shiftWeek + 1})"]),
                "countWeek(3)":sum(self._nuresSchedule[nures][f"shiftWeek({shiftWeek +2})"]),
                "countWeek(4)":sum(self._nuresSchedule[nures][f"shiftWeek({shiftWeek +3})"])
            }


    def SplitDay(self):
        ''' เเบ่งข้อมูลผลัดออกมาเป็นวัน [1, 1, 1] '''
        for i, N in enumerate(self._nuresSchedule):

            for shiftWeek in range(0 ,self._week):
                window = 3
                index = 0
                for i in range(0, self._day):
                    #print(N, self._nuresSchedule[N][f"shiftWeek({shiftWeek +1})"][index:window])
                    self.ConsecutivePart(nurse = N,
                                        shift = self._nuresSchedule[N][f"shiftWeek({shiftWeek +1})"][index:window],
                                        week = f"shiftWeek({shiftWeek +1})",
                                        index = index,
                                        window = window)

                    index +=3
                    window +=3



    def CountConsecutive(self, nures ,shift):
        shift = str(shift).strip("[, ]")
        if shift == '1 1 1' or shift == '0 1 1' or shift == '1 1 0':
            self.countConsecutive +=1

    def countShiftPerAllViolations(self):
        violations = 0
        weekShiftList = []

        for index, nures in enumerate(self._nuresSchedule):
            weekShiftList.append(f'{nures} : {sum(self._nuresSchedule[nures])}')

        return weekShiftList


class ContsTraint(Schedule):
    ''' คลาสนี้จะทำการสร้าง กฎต่างๆหรือ ContsTrint เเล้วทำการปรับข้อมูลตาราง'''
    def __init__(self, nurse, day, shift):
        super().__init__(nurse, day, shift)
        Schedule.__init__(self, nurse, day, shift)

    def ShiftLimit(self):
        ''' หนึ่งคนในหนึ่งสัปดาห์ต้องเข้าผลัดไม่เกิน 6 ผลัด ถ้าเกินให้สุ่มค่า Population ใหม่จนกว่าจะไม่เกิน'''

        for index, nurse in enumerate(self._countWeek):
            for i in range(self._week):
                while self._countWeek[nurse][f'countWeek({i+1})'] > 6:
                    self._nuresSchedule[nurse][f"shiftWeek({i+1})"] = np.random.randint(2, size = 21)
                    self.CountWeek()



    def ConsecutivePart(self, nurse, shift,week, index, window):
        '''หนึ่งวันต้องไม่มีการขึ้น 3 ผลัดในหนึ่งวัน เเล้วไม่มีมีการขึ้นผลัดบ่ายควบกับผลัดดึก ถ้าหากมี ก็ให้สุ่มข้อมูลผลัดใหม่จาก ที่กำหนดไว้'''
        shiftDream = [
        [1, 0, 0],
        [0, 1, 0],
        [0, 0, 1],
        [1, 1, 0],
        [1, 0, 1],
        [0, 0, 0]

        ]

        shift = str(shift).strip("[, ]")

        if shift == "1 1 1" or shift == "0 1 1":
            newShift =  np.random.randint(len(shiftDream), size = 1)
            self._nuresSchedule[nurse][week][index:window] = np.random.randint(2, size = 3)


    def LastDay(self):
        """ วันขึ้นวันใหม่กับวันสุดท้ายของสัปดาห์"""

        for index, nurse in enumerate(self._nuresSchedule):
            countWeek = 1
            shiftDream = [
                [1, 0, 0],
                [0, 1, 0],
                [0, 0, 1],
                [1, 0, 1],
                [0, 0, 0]
            ]
            for i in range(self._week):
                oldWeek = self._nuresSchedule[nurse][f'shiftWeek({countWeek})'][18:]
                newWeek = self._nuresSchedule[nurse][f'shiftWeek({countWeek +1})'][:3]

                newWeek = str(newWeek).strip("[, ]")
                oldWeek = str(oldWeek).strip("[, ]")

                if oldWeek == "0 0 1" and newWeek == "1 1 0":
                    self._nuresSchedule[nurse][f'shiftWeek({countWeek +1})'][:3] = np.random.randint(2, size = 3)

                if oldWeek == "1 0 1" and newWeek == "1 1 0":
                    self._nuresSchedule[nurse][f'shiftWeek({countWeek +1})'][:3] = np.random.randint(2, size = 3)

                countWeek +=1
                if countWeek >3 :
                    break


class SolutionCase(ContsTraint):
    """ class นี้เอาจัดการเรื่องของ case ต่าง ๆ ที่สร้างขึ้นมา"""
    def __init__(self, nurse, day, shift):
        super().__init__(nurse, day, shift)
        ContsTraint.__init__(self, nurse, day, shift)

        self.countCase = 0
    def SumCase(self):
        count = 0
        countWeek = 1
        for i in range(self._week):
          
          for index, nurse in enumerate(self._nurse):
            count +=  sum(self._nuresSchedule[nurse][f'shiftWeek({countWeek +1})'])

        return count
    
    def TestCase(self):
        """ เอาไว้รันในเเต่ละ case ที่เราสร้างขึ้นมา"""
        validation = len(self._nurse) * self.shift
        validated = 0
        while validated != validation:
          case = {
              "1":self.ScheduleNures(),
              "2":self.ScheduleNures(),
              "3":self.ShiftLimit(),
              "4":self.SplitDay(),
              "5":self.LastDay(),
            
          }

          for i in case:
              try:
                  case[f'{i}']
              except:
                  print("เกิดขึ้นผิดพลาดบางอย่างใน TestCase")
          validated = self.SumCase()
        
        """ รันครบทุก case เเล้วใหัทำการเเสดงผลออกมา """



def main():

    # print ('Number of arguments:', len(sys.argv), 'arguments.')
    # print ('Argument List:', str(sys.argv))
    
    nurse = sys.argv[1].split(",")
    nurse = ['A', 'B', 'C']
    Schedules = SolutionCase(nurse =  nurse, day = 7, shift = 20)
    Schedules.TestCase()
    Schedules.PrintSchedule()
    
if __name__ == "__main__":
    main()