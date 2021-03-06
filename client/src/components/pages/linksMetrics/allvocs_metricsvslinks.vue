<template>
  <div class="chart">
    <div>
      <span class="asdds">{{name}}</span>
      <div>
        Pearson correlation coefficient:
        <strong v-if="r">{{r.toFixed(3)}}</strong>
      </div>
      <Linee
        v-if="datacollection"
        :chart-data="datacollection"
        :styles="myStyles"
        :options="options"
      ></Linee>
    </div>
  </div>
</template>

<script>
import Linee from "@/components/chartsJS/Line.js";

export default {
  name: "Chart2",
  data() {
    return {
      datacollection: null,
      options: {
        maintainAspectRatio: false,
        legend: {
          display: this.$store.state.legend,
        },
        scales: {
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: this.scaleLabels.y,
                fontSize: 18,
              },
            },
          ],
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: this.scaleLabels.y,
                fontSize: 18,
              },
              type: "linear",
              position: "bottom",
            },
          ],
        },
      },
    };
  },
  components: {
    Linee,
  },
  computed: {
    r() {
      const avg = [0, 0];
      let n = 0;
      this.radar.forEach((el) => {
        avg[0] += Math.exp(+el.x) - 1;
        avg[1] += Math.exp(+el.y) - 1;
        n++;
      });
      avg[0] /= n;
      avg[1] /= n;
      let numerator = 0;
      let denominator = 0;
      let denominatorX = 0;
      let denominatorY = 0;
      this.radar.forEach((el) => {
        numerator +=
          (Math.exp(+el.x) - 1 - avg[0]) * (Math.exp(+el.y) - 1 - avg[1]);
        denominatorX += (Math.exp(+el.x) - 1 - avg[0]) ** 2;
        denominatorY += (Math.exp(+el.y) - 1 - avg[1]) ** 2;
      });
      denominator = Math.sqrt(denominatorX * denominatorY);
      return numerator / denominator;
    },
    myStyles() {
      return {
        height: `600px`,
        position: "relative",
      };
    },
  },
  watch: {
    radar() {
      this.setDataset();
    },
    "$store.state.transparency"() {
      this.setDataset();
    },
    "$store.state.legend"() {
      this.updateOptions();
    },
    "$store.state.minVersion"() {
      this.setDataset();
    },
    "$store.state.maxVersion"() {
      this.setDataset();
    },
    "$store.state.betweenVersionsTime"() {
      this.setDataset();
    },
    "$store.state.incomingLinks"() {
      this.setDataset();
    },
    "$store.state.outgoingLinks"() {
      this.setDataset();
    },
    "$store.state.yearsOfLife"() {
      this.setDataset();
    },
  },
  props: {
    radar: {},
    scaleLabels: {
      default: () => {
        return {
          x: "x-axes",
          y: "y-axes",
        };
      },
    },
    name: {},
  },
  mounted() {
    this.updateOptions();
    this.setDataset();
  },
  methods: {
    updateOptions() {
      this.options = {
        maintainAspectRatio: false,
        legend: {
          display: this.$store.state.legend,
        },
        scales: {
          xAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: this.scaleLabels.x,
                fontSize: 18,
              },
              type: "linear",
              position: "bottom",
              ticks: {
                userCallback: function (label) {
                  let n = Math.exp(+label) - 1;
                  return n > 10 ? n.toFixed() : n.toFixed(2);
                },
              },
            },
          ],
          yAxes: [
            {
              scaleLabel: {
                display: true,
                labelString: this.scaleLabels.y,
                fontSize: 18,
              },
              ticks: {
                userCallback: function (label) {
                  let n = Math.exp(+label) - 1;
                  return n > 10 ? n.toFixed() : n.toFixed(2);
                },
              },
            },
          ],
        },
      };
    },
    setDataset() {
      this.datacollection = {
        datasets: [
          {
            data: this.radar,
            backgroundColor: "#f8797900",
            borderColor: "#f8797900",
            pointBackgroundColor: "#f84545" + "c0",
            pointRadius: 4,
          },
        ],
      };
    },
  },
};
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.asdds {
  font-size: 1.4em;
}
</style>
