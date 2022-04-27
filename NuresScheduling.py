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
        self.Consecutive()

    def PrintSchedule(self):
        self.ScheduleNures()
        print('ตารางขึ้นเวร \n')
        for ind, nures in enumerate(self._nuresSchedule):
            print(f'{ind} {self._nuresSchedule[nures]}')


        print('')

    def CountWeek(self):
        for index, nures in enumerate(self._nuresSchedule):
            if sum(self._nuresSchedule[nures]) >= 6:
                self.countWeek[nures] = sum(self._nuresSchedule[nures])

    def Consecutive(self):
        for i, N in enumerate(self._nuresSchedule):
            window = 3
            index = 0
            for i in range(7):
                self._nuresSchedule[N][index:window]

                self.ConsecutivePart(nures = N, shift = self._nuresSchedule[N][index:window], index = index , window = window)
                self.CountConsecutive( nures = N, shift = self._nuresSchedule[N][index:window])
                index += 3
                window += 3

    def CountConsecutive(self, nures ,shift):
        shift = str(shift).strip("[, ]")
        count = 0
        if shift == '1 1 1' or shift == '0 1 1' or shift == '1 1 0':
            count +=1
            print('จำนวนผลัดที่ขึ้นติดต่อกัน', count)

    def TEST(self):
        """ """



class ContsTraint(Schedule):
    def __init__(self, nures, day):
        super().__init__(nures, day)
        Schedule.__init__(self, nures, day)

    def ShiftLimit(self):

        for index, nures in enumerate(self.countWeek):
            while sum(self._nuresSchedule[nures]) >= 6:
                pop = self.Population(size = 7)
                self._nuresSchedule[nures] = pop
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



def main():

    Schedules = ContsTraint(nures = ["A", "B", "C"], day = 7)
    Schedules.PrintSchedule()


if __name__ == "__main__":
    main()
