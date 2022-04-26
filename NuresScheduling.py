import numpy as np




class Schedule(object):
    def __init__(self, nures, day):
        self._nures = nures
        self._day = day
        self._shiftWeek = day * 3
        self._nuresSchedule = {}



    def Population(self):
        pop = np.random.randint(2, size = self._shiftWeek)

        return pop

    def ScheduleNures(self):

        for N in self._nures:
            self._nuresSchedule[N] = self.Population()


        self.CountWeek()
        self.ShiftLimit()


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
        ''' '''
        count = 0
        print("Start ShiftLimit function")
        for index, nures in enumerate(self.countWeek):
            print(f'ตารางเวร {self._nuresSchedule[nures]}')
            while sum(self._nuresSchedule[nures]) >= 6:
                pop = self.Population()
                self._nuresSchedule[nures] = pop
                count += 1
                self.CountWeek()




def main():

    Schedules = ContsTraint(nures = ["A", "B", "C", "D", "F"], day = 7)
    Schedules.ScheduleNures()
    Schedules.ShiftLimit()





if __name__ == "__main__":
    main()
