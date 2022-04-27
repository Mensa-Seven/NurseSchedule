import numpy as np




class Schedule(object):
    def __init__(self, nures, day):
        self._nures = nures
        self._day = day
        self._shiftWeek = day * 3
        self._nuresSchedule = {}

        self._countWeek = {}
        self.countConsecutive = 0


    def Population(self, size):
        pop = np.random.randint(2, size = size*3)

        return pop

    def ScheduleNures(self):

        for N in self._nures:
            self._nuresSchedule[N] = self.Population(size = 30)


        self.CountWeek()
        self.ShiftLimit()
        self.Consecutive()

    def PrintSchedule(self):
        self.ScheduleNures()
        print('ตารางขึ้นเวร ')
        for ind, nures in enumerate(self._nuresSchedule):
            print(f'{nures} {self._nuresSchedule[nures]}')


        print('จำนวนผลัดที่ขึ้นติดต่อกัน', self.countConsecutive)

    def CountWeek(self):
        for index, nures in enumerate(self._nuresSchedule):
            window = 21
            index = 0
            for i in range(4):
                self._countWeek[nures] = sum(self._nuresSchedule[nures][index:window])
                window += 21
                index += 21


    def Consecutive(self):
        for i, N in enumerate(self._nuresSchedule):
            window = 3
            index = 0
            for i in range(self._day):
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
    def __init__(self, nures, day):
        super().__init__(nures, day)
        Schedule.__init__(self, nures, day)

    def ShiftLimit(self):

        for index, nures in enumerate(self._countWeek):
            while self._countWeek[nures] >= 6:
                pop = self.Population(size = 30)
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

    Schedules = ContsTraint(nures = ["A", "C", "D"], day = 30)
    Schedules.PrintSchedule()


if __name__ == "__main__":
    main()
