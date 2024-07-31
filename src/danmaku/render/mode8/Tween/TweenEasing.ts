/** Easing方式 */
export class TweenEasing {

    static Back = {
        In: function (amount: number) {
            const s = 1.70158
            return amount === 1 ? 1 : amount * amount * ((s + 1) * amount - s)
        },
        Out: function (amount: number) {
            const s = 1.70158
            return amount === 0 ? 0 : --amount * amount * ((s + 1) * amount + s) + 1
        },
        InOut: function (amount: number) {
            const s = 1.70158 * 1.525
            if ((amount *= 2) < 1) {
                return 0.5 * (amount * amount * ((s + 1) * amount - s))
            }
            return 0.5 * ((amount -= 2) * amount * ((s + 1) * amount + s) + 2)
        },
    }

    static Bounce = {
        In: function (amount: number) {
            return 1 - TweenEasing.Bounce.Out(1 - amount)
        },
        Out: function (amount: number) {
            if (amount < 1 / 2.75) {
                return 7.5625 * amount * amount
            } else if (amount < 2 / 2.75) {
                return 7.5625 * (amount -= 1.5 / 2.75) * amount + 0.75
            } else if (amount < 2.5 / 2.75) {
                return 7.5625 * (amount -= 2.25 / 2.75) * amount + 0.9375
            } else {
                return 7.5625 * (amount -= 2.625 / 2.75) * amount + 0.984375
            }
        },
        InOut: function (amount: number) {
            if (amount < 0.5) {
                return TweenEasing.Bounce.In(amount * 2) * 0.5
            }
            return TweenEasing.Bounce.Out(amount * 2 - 1) * 0.5 + 0.5
        },
    }

    static Circular = {
        In: function (amount: number) {
            return 1 - Math.sqrt(1 - amount * amount)
        },
        Out: function (amount: number) {
            return Math.sqrt(1 - --amount * amount)
        },
        InOut: function (amount: number) {
            if ((amount *= 2) < 1) {
                return -0.5 * (Math.sqrt(1 - amount * amount) - 1)
            }
            return 0.5 * (Math.sqrt(1 - (amount -= 2) * amount) + 1)
        },
    }

    static Circ = this.Circular;

    static Cubic = {
        In: function (amount: number) {
            return amount * amount * amount
        },
        Out: function (amount: number) {
            return --amount * amount * amount + 1
        },
        InOut: function (amount: number) {
            if ((amount *= 2) < 1) {
                return 0.5 * amount * amount * amount
            }
            return 0.5 * ((amount -= 2) * amount * amount + 2)
        },
    }

    static Elastic = {
        In: function (amount: number) {
            if (amount === 0) {
                return 0
            }

            if (amount === 1) {
                return 1
            }

            return -Math.pow(2, 10 * (amount - 1)) * Math.sin((amount - 1.1) * 5 * Math.PI)
        },
        Out: function (amount: number) {
            if (amount === 0) {
                return 0
            }

            if (amount === 1) {
                return 1
            }
            return Math.pow(2, -10 * amount) * Math.sin((amount - 0.1) * 5 * Math.PI) + 1
        },
        InOut: function (amount: number) {
            if (amount === 0) {
                return 0
            }

            if (amount === 1) {
                return 1
            }

            amount *= 2

            if (amount < 1) {
                return -0.5 * Math.pow(2, 10 * (amount - 1)) * Math.sin((amount - 1.1) * 5 * Math.PI)
            }

            return 0.5 * Math.pow(2, -10 * (amount - 1)) * Math.sin((amount - 1.1) * 5 * Math.PI) + 1
        },
    }

    static Exponential = {
        In: function (amount: number) {
            return amount === 0 ? 0 : Math.pow(1024, amount - 1)
        },
        Out: function (amount: number) {
            return amount === 1 ? 1 : 1 - Math.pow(2, -10 * amount)
        },
        InOut: function (amount: number) {
            if (amount === 0) {
                return 0
            }

            if (amount === 1) {
                return 1
            }

            if ((amount *= 2) < 1) {
                return 0.5 * Math.pow(1024, amount - 1)
            }

            return 0.5 * (-Math.pow(2, -10 * (amount - 1)) + 2)
        },
    }

    static Expo = this.Exponential;

    static Linear = {
        None: function (amount: number) {
            return amount
        },
    }

    static Quadratic = {
        In: function (amount: number) {
            return amount * amount
        },
        Out: function (amount: number) {
            return amount * (2 - amount)
        },
        InOut: function (amount: number) {
            if ((amount *= 2) < 1) {
                return 0.5 * amount * amount
            }

            return -0.5 * (--amount * (amount - 2) - 1)
        },
    }

    static Quad = this.Quadratic;

    static Quartic = {
        In: function (amount: number) {
            return amount * amount * amount * amount
        },
        Out: function (amount: number) {
            return 1 - --amount * amount * amount * amount
        },
        InOut: function (amount: number) {
            if ((amount *= 2) < 1) {
                return 0.5 * amount * amount * amount * amount
            }

            return -0.5 * ((amount -= 2) * amount * amount * amount - 2)
        },
    }

    static Quart = this.Quartic;

    static Quintic = {
        In: function (amount: number) {
            return amount * amount * amount * amount * amount
        },
        Out: function (amount: number) {
            return --amount * amount * amount * amount * amount + 1
        },
        InOut: function (amount: number) {
            if ((amount *= 2) < 1) {
                return 0.5 * amount * amount * amount * amount * amount
            }

            return 0.5 * ((amount -= 2) * amount * amount * amount * amount + 2)
        },
    }

    static Quint = this.Quintic;

    static SIne(t: number, b: number, c: number, d: number) {
        return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
    }
}