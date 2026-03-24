import styles from './dasboard.module.css'

function Dashboard() {

  const headCart = [
    {
      txt: "Jami Vazifalar",
      Protect: 12,
    },
    {
      txt: "bajarilganlar",
      Protect: 5,
    },
    {
      txt: "qolganlar",
      Protect: 7,
    },

    {
      txt: "deadline yaqin",
      Protect: 2,
    },
  ]
  return (
    <div className={styles.DashboardContainer}>
      <div className={styles.cartCntainer}>
        {headCart && headCart.map((txt) => {
          return (
            <div className={styles.cart} key={txt.txt}>
              <p className={styles.cartTXT}>{txt.txt}</p>
              <small className={styles.cartProtect}>{txt.Protect}</small>

              {txt.txt === "Jami Vazifalar" && (
                <div className={styles.statusBar} />
              )}
            </div>
          )
        })}
      </div>




    </div>
  )
}

export default Dashboard