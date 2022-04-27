import numpy as np




class Schedule(object):
    def __init__(self, nures, day):
        self._nures = nures
        self._day = day
        self._shiftWeek = day * 3
        self._nuresSchedule = {}

        self.countWeek = {}
        self.countConsecutive = {}

    def Population(self, size):
        pop = np.random.randint(2, size = size*3)

        return pop

    def ScheduleNures(self):

        for N in self._nures:
            self._nuresSchedule[N] = self.Population(size = 7)


        self.CountWeek()
        self.ShiftLimit()
        self.CountConsecutive()

    def PrintSchedule(self):
        self.ScheduleNures()
        print('ตารางขึ้นเวร \n')
        for ind, nures in enumerate(self._nuresSchedule):
            print(f'{ind} {self._nuresSchedule[nures]}')

        print('')
        print('จำนวนในการสุ่มตารางให้เข้าเป้าทั้งหมด ',self.count ,'ครั้ง')

    def CountWeek(self):
        for index, nures in enumerate(self._nuresSchedule):
            if sum(self._nuresSchedule[nures]) >= 6:
                self.countWeek[nures] = sum(self._nuresSchedule[nures])

    def CountConsecutive(self):
        for i, N in enumerate(self._nuresSchedule):
            window = 3
            index = 0
            for i in range(7):
                self._nuresSchedule[N][index:window]
                self.ConsecutivePart(nures = N, shift = self._nuresSchedule[N][index:window], index = index , window = window)

                index += 3
                window += 3


    def TEST(self):
        """ """



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

    def ConsecutivePart(self, nures, shift, index, window):

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

            self.count += 1






def main():

    Schedules = ContsTraint(nures = ["A", "B", "C"], day = 7)
    Schedules.PrintSchedule()
    Schedules.TEST()


if __name__ == "__main__":
    main()
