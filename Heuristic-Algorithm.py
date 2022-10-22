import copy
from curses import window
from operator import index
from select import select
from unittest.mock import seal
import numpy as np
import sys
import json


class Schedule(object):
    def __init__(self, nurse, day = 31, maxShift = 0,minShift = 0,minShiftDay = 0, minShiftMonth = 0, mixShiftMonth = 0):
        ''' กำหนด constructor ของการสร้างตาราง '''
        #เก็บข้อมูลพยาบาล
        self._nurse = nurse
        #จำนวนวันที่ต้องการสร้าง
        self._day = day
        #กำหนดความยาวของยีน
        self.geneLen = day * 3
        #เก็บข้อมูลสมาชิกเเละตาราง
        self._nuresSchedule = {}
        #จำนวนขั้นต่ำของจำนวนคนขึ้นผลัด ในแต่ละวัน
        self._minShiftDay = minShiftDay
        #จำนวนผลัดอย่างน้อยที่ ต้องขึ้นใน แต่ละเดือน
        self._minShiftMonth = minShiftMonth
        #จำนวนผลัดอย่างมากที่สุดที่สามารถเข้ากลุ่มได้
        self._mixShiftMonth = mixShiftMonth
        #จำนวนผลัดทขั้นต่ำที่จะต้องขึ้น ในแต่ละผลัด
        self._minShift = minShift
        #จำนวนผลัดที่เยอะที่สุดที่สามารถขึ้นได้ ในหนึ่งคน ต่อหนึ่งวัน
        self._maxShift = maxShift
        #เอาไว้นับจำนวนขึ้นผลัดในแต่ละแบบ
        self._countTwoShift = 0
        self._countOneShift = 0
        self._countThreeShift = 0
        self._countDay = 0

    def Population(self, size = 31):
        '''สุ่มค่า Population'''
        pop = np.random.randint(2, size = size)

        return pop


    def CreateShiftNures(self):
        ''' สร้างตาราง gen ของตารางพยาบาล '''
        for index, nures in enumerate(self._nurse):
            pop = self.Population(size=self.geneLen)
            self._nuresSchedule[nures] = pop
    
    def MinShift(self):
        ''' ฟังก์ชันสำหรับเช็คว่า ในหนึ่งวันนั้น มีคนเข้าผลัดกี่ ผลัด'''

        for index, nurse in enumerate(self._nuresSchedule):
            window = 3
            ind = 0

            for i in range(0, self._day):
                #print(f"day {i +1} nurse {nurse} shift {self._nuresSchedule[nurse][ind:window]}")
                
                while np.sum(self._nuresSchedule[nurse][ind:window]) == self._maxShift or np.sum(self._nuresSchedule[nurse][ind:window]) < self._minShift:
                    ''' เงื่อนไข case ในหนึ่งวันมีการขึ้นผลัดน้องกว่า ที่กำหนดไว้ ถ้าน้อยกว่าขั้นต่ำก็ว่าจะเช็คใหม่'''
                    #print(f"day {i +1} nurse {nurse} shift {self._nuresSchedule[nurse][ind:window]}")
                    #print(f'ก่อน {self._nuresSchedule[nurse][ind:window]} sum {np.sum(self._nuresSchedule[nurse][ind:window])}')
                    
                    crossOver = []
                    p1 = self.Population(size=3)
                    p2 = self.Population(size=3)

                    select = [p1, p2]
                    crossOver = select[int(np.random.randint(2, size=1))]
                    self._nuresSchedule[nurse][ind:window] = crossOver
                    #print(f'หลัง {nurse} {self._nuresSchedule[nurse][ind:window]} sum {np.sum(self._nuresSchedule[nurse][ind:window])}')
            
                window +=3
                ind +=3
            

    def minShiftDay(self):
        ''' ฟังก์ชันสำหรับเช็คว่า ในหนึ่งวันนั้น มีจำนวนผลัดครบตามจำนวนขั้นต่ำที่ตั้งไว้หรือไม่'''
        window = 3
        index = 0
        for i in range(self._day):
            countDay = 0
            for N, nurse in enumerate(self._nurse):
                #print(f'Day {i+1} Nurse {nurse} {index, window} shift {self._nuresSchedule[nurse][index:window]}')
                #print('CountDay', countDay)
                countDay += np.sum(self._nuresSchedule[nurse][index:window])

            if countDay < self._minShiftDay:
                #print(f'Day {i+1} Nurse {nurse} {index, window} shift {self._nuresSchedule[nurse][index:window]}')
                #print(countDay)
                self.MinShift()

            window +=3
            index +=3
    
    def MinShiftMonth(self):
        ''' ฟังก์ชันสำหรับเช็ค จำนวนผลัดขั้นต่ำของการทำงานแต่ละเดือน '''

        for N, nurse in enumerate(self._nurse):
            
            print(sum(self._nuresSchedule[nurse]))

            if sum(self._nuresSchedule[nurse]) < self._minShiftMonth and sum(self._nuresSchedule[nurse]) < self._mixShiftMonth:
                return False
        
        return True

    def PrintSchedule(self):
        for ind, nurse in enumerate(self._nurse):
            #data = {}
            # data = json.dump({
            #     [nurse]: self._nuresSchedule[nurse]
            # })
            print(f'{nurse}:{list(self._nuresSchedule[nurse])}')
        # print(list(self._nuresSchedule))    
      


    def CountShiftDay(self):
        ''' ฟังก์ชันสำหรับนับจำนวนผลัดที่ขึ้นติดต่อกัน 3 ผลัดในหนึ่งวัน'''
        
        for n, nurse in enumerate(self._nurse):
            window = 3 
            index = 0
            for i in range(self._day):
                #นับจำนวนผลัดที่ขึ้นหนึ่งผลัดในหนึ่งวัน
                if np.sum(self._nuresSchedule[nurse][index:window]) == 1: self._countOneShift +=1
                #นับจำนวนผลัดที่ขึ้นสองผลัดในหนึ่งวัน
                if np.sum(self._nuresSchedule[nurse][index:window]) == 2: self._countTwoShift +=1
                #นับจำนวนผลัดที่ขึ้นสองผลัดในหนึ่งวัน
                if np.sum(self._nuresSchedule[nurse][index:window]) == 3: self._countThreeShift +=1

                window +=3 
                index +=3

    def CountDay(self):
        '''นับจำนวนผลัดที่ขึ้นเกินกำของหนึ่งวัน'''
        window = 3
        index = 0
        for i in range(self._day):
           
            countDay = 0
            for N, nurse in enumerate(self._nurse):
                #print(f'Day {i+1} Nurse {nurse} {index, window} shift {self._nuresSchedule[nurse][index:window]}')
                #print('CountDay', countDay)
                countDay += np.sum(self._nuresSchedule[nurse][index:window])


            if countDay < self._minShiftDay:
                #print(f'Day {i+1} Nurse {nurse} {index, window} shift {self._nuresSchedule[nurse][index:window]}')
                #print(countDay)
                self._countDay +=1


            window +=3
            index +=3
    
    def Run(self):
        ''' Main '''
        # validation = self.MinShiftMonth()
        
        self.minShiftDay()
        self.PrintSchedule()
        # self.CountShiftDay()
        self.CountDay()



def main():
    nurse = sys.argv[1].split(",")
    option = json.loads(sys.argv[2])

    #init
    schedule = Schedule(nurse=nurse,
        day = int(option["day"]),
        maxShift=int(option["maxShift"]),
        minShift=int(option["minShift"]), 
        minShiftDay=int(option["minShiftDay"]), 
        minShiftMonth =int(option["minShiftMonth"]),
        mixShiftMonth = len(nurse) * 22)

    schedule.CreateShiftNures()
    schedule.Run()


    #print('จำนวนผลัดที่ขึ้นหนึ่งผลัด', schedule._countOneShift)
    #print('จำนวนผลัดที่ขึ้นสองผลัด', schedule._countTwoShift)
    #print('จำนวนผลัดที่ขึ้นสามผลัด', schedule._countThreeShift)
    #print('จำนวนผลัดที่ขึ้นเกินจำนวนวันที่กำหนด', schedule._countDay)

if __name__ == "__main__":
    main()
