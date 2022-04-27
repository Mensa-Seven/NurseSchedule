import numpy as np




class Schedule(object):
    def __init__(self, nures, day):
        ''' กำหนด constructor ของการสร้างตาราง'''
        #เก็บข้อมูลพยาบาล
        self._nures = nures
        #จำนวนวันที่ต้องการสร้าง
        self._day = day
        #กำหนดความยาวของยีน
        self._geneLen = day * 3
        #เก็บข้อมูลสมาชิกเเละตาราง
        self._nuresSchedule = {}
        #เก็บข้อมูล sum ของการทำงานเเต่ละสัปดาห์
        self._countWeek = {}
        #นับจำนวนผลัดที่ขึ้นติดต่อกัน
        self.countConsecutive = 0



    def Population(self, size):
        '''สุ่มค่า Population'''
        pop = np.random.randint(2, size = self._geneLen)

        return pop

    def ScheduleNures(self):
        ''' สร้างตารางตารางขึ้นเวร จากค่า Population '''

        for N in self._nures:
            ''' เอาข้อมูลสมาชิกทั้งหมด มาใส่ค่า Poppulation เเล้วสร้างเป็น Dictionay '''
            self._nuresSchedule[N] = self.Population(size = 30)


        self.CountWeek()
        self.ShiftLimit()
        self.Consecutive()

    def PrintSchedule(self):
        ''' เเสดงค่าผลต่าง ๆ หลังจากกันจัดเรียงข้อมูลทั้งหมด'''
        self.ScheduleNures()
        print('ตารางขึ้นเวร')
        for ind, nures in enumerate(self._nuresSchedule):
            print(f'{nures} {self._nuresSchedule[nures]}')


        print('จำนวนผลัดที่ขึ้นติดต่อกัน', self.countConsecutive)

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
        for i, N in enumerate(self._nuresSchedule):
            window = 3
            index = 0


            for i in range(self._day):
                ''' สร้างผลัดออกมาเป็น 30 วัน'''
                self._nuresSchedule[N][index:window]


                self.ConsecutivePart(nures = N, shift = self._nuresSchedule[N][index:window], index = index , window = window)
                self.CountConsecutive( nures = N, shift = self._nuresSchedule[N][index:window])
                index += 3
                window += 3


    def CountConsecutive(self, nures ,shift):
        shift = str(shift).strip("[, ]")
        if shift == '1 1 1' or shift == '0 1 1' or shift == '1 1 0':
            self.countConsecutive +=1




class ContsTraint(Schedule):
    ''' คลาสนี้จะทำการสร้าง กฎต่างๆหรือ ContsTrint เเล้วทำการปรับข้อมูลตาราง'''
    def __init__(self, nures, day):
        super().__init__(nures, day)
        Schedule.__init__(self, nures, day)

    def ShiftLimit(self):
        ''' หนึ่งคนในหนึ่งสัปดาห์ต้องเข้าผลัดไม่เกิน 6 ผลัด ถ้าเกินให้สุ่มค่า Population ใหม่จนกว่าจะไม่เกิน'''

        for index, nures in enumerate(self._countWeek):
            while self._countWeek[nures] > 6:
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
        [1, 0, 1]
        ]

        shift = str(shift).strip("[, ]")

        if shift == "1 1 1" or shift == "0 1 1":
            newShift = np.random.randint(len(shiftDream), size = 1)
            self._nuresSchedule[nures][index:window] = shiftDream[newShift[0]]



def main():

    Schedules = ContsTraint(nures = ["A", "C", "D"], day = 30)
    Schedules.PrintSchedule()


if __name__ == "__main__":
    main()
