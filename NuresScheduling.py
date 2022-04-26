import numpy as np




class Schedule(object):
    def __init__(self, nures, day):
        self._nures = nures
        self._day = day
        self._shiftWeek = day * 3
        self._nuresSchedule = {}



    def Population(self, size):
        pop = np.random.randint(2, size = size*3)

        return pop

    def ScheduleNures(self):

        for N in self._nures:
            self._nuresSchedule[N] = self.Population(size = 7)


        self.CountWeek()
        self.ShiftLimit()

    def PrintSchedule(self):
        self.ScheduleNures()
        print('ตารางขึ้นเวร')
        for ind, nures in enumerate(self._nuresSchedule):
            print(f'{ind} {self._nuresSchedule[nures]}')

        print('จำนวนในการสุ่มตารางให้เข้าเป้าทั้งหมด ',self.count ครั้ง)

    def CountWeek(self):
        self.countWeek = {}
        for index, nures in enumerate(self._nuresSchedule):
            if sum(self._nuresSchedule[nures]) >= 6:
                self.countWeek[nures] = sum(self._nuresSchedule[nures])





class ContsTraint(Schedule):
    def __init__(self, nures, day):
        super().__init__(nures, day)
        Schedule.__init__(self, nures, day)

    def ShiftLimit(self):

        self.count = 0
        for index, nures in enumerate(self.countWeek):
            while sum(self._nuresSchedule[nures]) >= 6:
                pop = self.Population(size = 7)
                self._nuresSchedule[nures] = pop
                self.count += 1
                self.CountWeek()





def main():

    Schedules = ContsTraint(nures = ["A", "B", "C", "D", "F"], day = 7)
    Schedules.PrintSchedule()



if __name__ == "__main__":
    main()
