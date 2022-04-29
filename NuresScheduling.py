import numpy as np
import pandas as pd
import json
from os import path


class Schedule(object):
    def __init__(self, nurse, day):
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
        self._data = {}



    def Population(self, size):
        '''สุ่มค่า Population'''
        pop = np.random.randint(2, size = self._geneLen)

        return pop

    def ScheduleNures(self):
        ''' สร้างตารางตารางขึ้นเวร จากค่า Population '''

        for index, nurse in enumerate(self._nurse):
            self._nuresSchedule[nurse] = {
                "shiftWeek(1)":self.Population(size = 7),
                "shiftWeek(2)":self.Population(size = 7),
                "shiftWeek(3)":self.Population(size = 7),
                "shiftWeek(4)":self.Population(size = 7),
            }

        self._shiftFrame = pd.DataFrame(self._nuresSchedule)

        #print(json.dumps(data))
        #self.CountWeek()
        #self.ShiftLimit()
        #self.Consecutive()

    def PrintSchedule(self):
        ''' เเสดงค่าผลต่าง ๆ หลังจากกันจัดเรียงข้อมูลทั้งหมด'''
        self.ScheduleNures()
        allSumshift = self.countShiftPerAllViolations()
        print('ตารางขึ้นเวร')
        for ind, nures in enumerate(self._nuresSchedule):
            print(f'{nures} {self._nuresSchedule[nures]}')


        print('จำนวนผลัดที่ขึ้นติดต่อกัน', self.countConsecutive)
        print("จำนวนผลัดของเเต่ละคน", allSumshift)

    def CountWeek(self):
        ''' สร้างเก็บข้อมููลการทำงานรวมในเเต่ละสัปดาห์'''
        for index, nures in enumerate(self._nuresSchedule):
            window = 21
            index = 0

            for i in range(4):
                '''รวมผลัดทั้งหมดในเเต่ละสัปดาห์'''
                self._countWeek[nures] = sum(self._nuresSchedule[nures][index:window])
                window += 21
                index += 21


    def Consecutive(self):
        ''' เเบ่งข้อมูลผลัดออกมาเป็นวัน [1, 1, 1] '''
        data = []
        for i, N in enumerate(self._nuresSchedule):
            window = 3
            index = 0

            for i in range(0 ,self._day):
                ''' สร้างผลัดออกมาเป็น 30 วัน'''
                self.ConsecutivePart(nures = N, shift = self._nuresSchedule[N][index:window], index = index , window = window)
                self.CountConsecutive( nures = N, shift = self._nuresSchedule[N][index:window])

                print(N,'',self._nuresSchedule[N][index:window])
                data.append(f'{N}:{self._nuresSchedule[N][index:window]}')
                #pd.DataFram(data = self._nuresSchedule[N][index:window])
                index += 3
                window += 3

        #data = str(data)
        #data = data.strip("[, ]")

        #print(data)





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
    def __init__(self, nurse, day):
        super().__init__(nurse, day)
        Schedule.__init__(self, nurse, day)

    def ShiftLimit(self):
        ''' หนึ่งคนในหนึ่งสัปดาห์ต้องเข้าผลัดไม่เกิน 6 ผลัด ถ้าเกินให้สุ่มค่า Population ใหม่จนกว่าจะไม่เกิน'''

        for index, nures in enumerate(self._countWeek):
            while self._countWeek[nures] > 5:
                pop = self.Population(size = 30)
                self._nuresSchedule[nures] = pop
                self.CountWeek()



    def ConsecutivePart(self, nures, shift, index, window):
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
            newShift = np.random.randint(len(shiftDream), size = 1)
            self._nuresSchedule[nures][index:window] = shiftDream[newShift[0]]



def main():

    Schedules = ContsTraint(nurse = ["A", "C", "D"], day = 7)
    Schedules.ScheduleNures()
    print(Schedules._shiftFrame)


if __name__ == "__main__":
    main()
